from rest_framework import serializers
from .models import Document
import os

class DocumentSerializer(serializers.ModelSerializer):
    sign_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['token', 'sender_iin', 'receiver_iin', 'status', 'file', 'sign_url', 'created_at']
        read_only_fields = ['token', 'status', 'sign_url', 'created_at']
    
    def get_sign_url(self, obj):
        return f"http://localhost:3000/sign/{obj.token}"
    
    def validate_file(self, value):
        ext = os.path.splitext(value.name)[1]
        if ext.lower() != '.pdf':
            raise serializers.ValidationError("Only PDF files are allowed.")
        return value

class DecisionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['accepted', 'rejected'])

class DocumentListSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['token', 'sender_iin', 'receiver_iin', 'status', 'file_url', 'created_at']
    
    def get_file_url(self, obj):
        return f"http://localhost:8000{obj.file.url}"
