from django.views.generic import ListView, CreateView , UpdateView , View
from .models import Card
from django.shortcuts import redirect
from django.urls import reverse_lazy 
from .forms import CardCreateForm 
import logging

logger = logging.getLogger(__name__)

class CardListView(ListView):
    model = Card
    template_name = 'card/index.html'


class CardCreateView(CreateView):
    model = Card
    template_name = 'card/create.html'
    form_class = CardCreateForm
    success_url = reverse_lazy('card:list')

class CardUpdateView(UpdateView):
    model = Card
    template_name = 'card/create.html'
    form_class = CardCreateForm
    success_url = reverse_lazy('card:list')

#要修正
class DeleteSelectedView(View):
    def post(self, request, *args, **kwargs):
        selected_cards = request.POST.getlist('selected_cards')
        
        # 選択されたカードが存在しない場合のエラーハンドリング
        if not selected_cards:
            logger.error("削除対象のカードが選択されていません。")
            return redirect('card:list')
            
        # 指定されたIDに紐づくカードが存在するか確認
        existing_cards = Card.objects.filter(id__in=selected_cards).count()
        if existing_cards != len(selected_cards):
            logger.error("指定されたIDのカードの一部または全てが存在しません。")
            return redirect('card:list')
            
        # 全ての確認が完了したら削除を実行
        Card.objects.filter(id__in=selected_cards).delete()
        return redirect('card:list')
