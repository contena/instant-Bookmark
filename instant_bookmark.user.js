// ==UserScript==
// @name        instant bookmark
// @namespace   contena
// @include     http://www.pixiv.net/bookmark_add.php?id=*
// @include     http://www.pixiv.net/bookmark_detail.php?illust_id=*
// @include     http://www.pixiv.net/recommended.php
// @include     http://www.pixiv.net/search.php*
// @include     http://www.pixiv.net/bookmark_new_illust.php
// @version     1
// @grant       none
// ==/UserScript==
var beforeRecommnedSize = 0;

$(function(){
  //検索結果の数を取得（フォロー新着ページも）
//   var userSize = $("._image-items.no-user > .image-item").size();
  var searchSize = $("._image-items.autopagerize_page_element > .image-item").size();
//   console.log(searchSize);

  /*
  他の絵の部分にはdata-tagsの値が入っていないので取得できない？
  */
  
  //検索結果の作品の数は変わらないので、最初にやって終了　
  //フォロー新着ページでも使用しているクラスが同じなため起動する
  if(searchSize !== 0){
    for(var i =0; i < searchSize; i++){
      addLinkUserWorks(i);
    }
  }
  //おすすめ作品の処理
    var recommendSize = $("._image-items.no-response > .image-item").size();
//   console.log(recommendSize);
  beforeRecommendSize = recommendSize;

   setInterval(autoUpdate,5000);
  
  //ブックマークボタンが押されたときに呼び出し
  $(document).on("click","input",function(){
    $(this).prop("disabled",true);
    var id = $(this).attr("data-check");
    console.log(id);
    var illustId = $(this).attr("id");
    //ボタンが押された部分のimage-itemからタグを取得
    var tag = $(this).parent().find("._thumbnail.ui-scroll-view").attr("data-tags");
//    console.log(tag);
    console.log(illustId);
    addBookmark(illustId,id,tag);
  });

});

function autoUpdate(){
    var recommendSize = $("._image-items.no-response > .image-item").size();
     if(recommendSize != beforeRecommendSize){
       for(var i =0; i < recommendSize; i++){
         if(!$("._image-items.no-response> .image-item:eq("+i+") > input").hasClass("addBookmark")){
          //既に追加されていた場合は追加しない
           addLinkRecommendWorks(i);
           }
      }
       beforeRecommendSize = recommendSize;
     }
}

//ほかの作品に追加
function addLinkUserWorks(i){
    var url = $("._image-items > .image-item:eq("+i+") > a:nth-child(1)").attr("href");
    var position = url.indexOf("id=");
    var id = url.slice(position + 3);
    if(id.indexOf("&") !== -1){
     id = id.substring(0,id.indexOf("&"));
    }
//     $("._image-items.no-user > .image-item:eq("+i+")").append('<a href=http://www.pixiv.net/bookmark_add.php?type=illust&illust_id=' +id+ '>ブックマークに追加</a>');
      $("._image-items > .image-item:eq("+i+")").append('<br><input id='+id+' class='+ "addBookmark" +' type="button" value=ブックマーク data-check='+ i +'>');
}

//おすすめ作品に追加
function addLinkRecommendWorks(i){
    var url = $("._image-items.no-response> .image-item:eq("+i+") > a:eq(1)").attr("href");
    var position = url.indexOf("id=");
    var id = url.slice(position + 3);
    id = id.substring(0,id.indexOf("&")); 
    if(id.indexOf("&") !== -1){
     id = id.substring(0,id.indexOf("&"));
    }
//     $("._image-items.no-response > .image-item:eq("+i+")").append('<br><a class='+ "addBookmark"+' href=http://www.pixiv.net/bookmark_add.php?type=illust&illust_id=' +id+ '>ブックマークに追加</a>');
    $("._image-items.no-response > .image-item:eq("+i+")").append('<br><input id='+id+' class='+ "addBookmark" +' type="button" value=ブックマーク data-check='+ i +'>');
  
}

function addBookmark(illustId,id,tag){
  //var tag = $("._image-items > .image-item:eq("+id+") > .work._work > ._layout-thumbnail > ._thumbnail.ui-scroll-view").attr("data-tags");
  
  console.log(tag);
  $.ajax({
    type: "POST",
    url: "http://www.pixiv.net/bookmark_add.php?id="+illustId,
    datatype:"json",
    data:{
      mode: "add",
      tt : "f04fc2ed380f79594cbf69bb9c10a7c2",
      id : illustId,
      type: "illust",
      from_sid : "",
      comment : "",
      tag : tag,
      restrict: 0,
    },
    success: function(data){
//       console.log(data);
      console.log("success");
    },
    error: function(data){
      console.log("error");
    }
   });
}