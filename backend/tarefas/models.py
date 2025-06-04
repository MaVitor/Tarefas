from django.db import models
from django.contrib.auth.models import User


class Projeto(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    proprietario = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Projeto"
        verbose_name_plural = "Projetos"


class Tarefa(models.Model):
    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ("em_progresso", "Em Progresso"),
        ("concluída", "Concluída"),
    ]

    titulo = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_conclusao = models.DateTimeField(null=True, blank=True)
    projeto = models.ForeignKey(Projeto, related_name='tarefas', on_delete=models.CASCADE)
    atribuido_a = models.ForeignKey(
        User, 
        null=True, 
        blank=True, 
        related_name='tarefas_atribuidas', 
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Tarefa"
        verbose_name_plural = "Tarefas"
