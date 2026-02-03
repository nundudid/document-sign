from django.db import models
import uuid
import os

def pdf_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.token}.{ext}"
    return os.path.join('pdfs', filename)

class Document(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    sender_iin = models.CharField(max_length=12)
    receiver_iin = models.CharField(max_length=12)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    file = models.FileField(upload_to=pdf_file_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.token} - {self.status}"
