from django.urls import path
from . import views

urlpatterns = [
    path('bitrix/documents/', views.CreateDocumentView.as_view(), name='create-document'),
    path('documents/sent/', views.SentDocumentsView.as_view(), name='sent-documents'),
    path('documents/received/', views.ReceivedDocumentsView.as_view(), name='received-documents'),
    path('documents/<uuid:token>/file/', views.FileView.as_view(), name='file-view'),
    path('documents/<uuid:token>/decision/', views.DecisionView.as_view(), name='decision'),
]
