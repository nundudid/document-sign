from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Document
from .serializers import DocumentSerializer, DecisionSerializer, DocumentListSerializer
import uuid

class CreateDocumentView(generics.CreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = DocumentSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class SentDocumentsView(generics.ListAPIView):
    serializer_class = DocumentListSerializer
    
    def get_queryset(self):
        sender_iin = self.request.GET.get('sender_iin')
        if sender_iin:
            queryset = Document.objects.filter(sender_iin=sender_iin).order_by('-created_at')
            return queryset
        return Document.objects.none()

class ReceivedDocumentsView(generics.ListAPIView):
    serializer_class = DocumentListSerializer
    
    def get_queryset(self):
        receiver_iin = self.request.GET.get('receiver_iin')
        print(f"Debug - Received Documents - Received receiver_iin: {receiver_iin}")
        if receiver_iin:
            queryset = Document.objects.filter(receiver_iin=receiver_iin).order_by('-created_at')
            return queryset
        return Document.objects.none()


class FileView(APIView):
    def get(self, request, token):
        try:
            document = Document.objects.get(token=token)
            file_url = request.build_absolute_uri(document.file.url)
            return Response({'file_url': file_url})
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=404)
        except ValueError:
            return Response({'error': 'Invalid token'}, status=400)

class DecisionView(APIView):
    def post(self, request, token):
        try:
            document = Document.objects.get(token=token)
        except Document.DoesNotExist:
            return Response({'error': 'Document not found'}, status=404)
        except ValueError:
            return Response({'error': 'Invalid token'}, status=400)
        
        if document.status in ['accepted', 'rejected']:
            return Response(
                {'error': 'Document already has a final decision'},
                status=409
            )
        
        serializer = DecisionSerializer(data=request.data)
        if serializer.is_valid():
            document.status = serializer.validated_data['status']
            document.save()
            return Response({'status': document.status})
        
        return Response(serializer.errors, status=400)
