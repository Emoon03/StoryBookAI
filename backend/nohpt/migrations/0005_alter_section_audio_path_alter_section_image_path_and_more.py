# Generated by Django 4.0.5 on 2024-02-17 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nohpt', '0004_book_current_section'),
    ]

    operations = [
        migrations.AlterField(
            model_name='section',
            name='audio_path',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='section',
            name='image_path',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='section',
            name='music_path',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]
