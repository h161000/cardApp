from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Card
from .serializers import CardSerializer


# カード一覧の取得と新規作成のAPIビュー
# "ListCreateAPIView"：Django REST frameworkが提供するビューで、　GETとPOSTメソッドをサポート
class CardListCreateAPIView(generics.ListCreateAPIView):
    # 全てのカードを降順で取得
    queryset = Card.objects.all().order_by("-created_at")
    # serializer.pyの"CardSerializer"Class
    serializer_class = CardSerializer
    # IsAuthenticated:認証された人のみAPIアクセスできる
    permission_classes = [IsAuthenticated]


# カード詳細の取得、更新、削除のAPIビュー
# "RetrieveUpdateDestroyAPIView"：Django REST frameworkが提供するビューで、GET、PUT、DELETEメソッドをサポート
class CardDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    # 全てのカードを取得
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]


# 選択したカードを削除するAPIビュー
class DeleteSelectedCardsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # チェックが入ったカードのIDリストを取得
        selected_cards = request.data.get("selected_cards", [])

        if not selected_cards:
            return Response(
                {"error": "削除するカードを選択してください。"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 存在するカードのみ削除
        # 削除されたカードの数を取得
        deleted_count = Card.objects.filter(id__in=selected_cards).delete()[0]

        if deleted_count > 0:
            return Response(
                {"message": f"{deleted_count}件のカードを削除しました。"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "指定されたカードは存在しません。"},
                status=status.HTTP_404_NOT_FOUND,
            )
