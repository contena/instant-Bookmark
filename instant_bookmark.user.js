// ==UserScript==
// @name        instant bookmark
// @namespace   contena
// @include     http://www.pixiv.net/bookmark_add.php?id=*
// @include     http://www.pixiv.net/bookmark_detail.php?illust_id=*
// @include     http://www.pixiv.net/bookmark.php
// @include     http://www.pixiv.net/recommended.php
// @version     1
// @grant       none
// ==/UserScript==
var beforeRecommnedSize = 0;

$(function(){
  //他の絵の数と、おすすめ作品の数を取得
  var userSize = $("._image-items.no-user > .image-item").size();
  var recommendSize = $("._image-items.no-response > .image-item").size();
  beforeRecommendSize = recommendSize;

  /*
  他の絵の部分にdata-tagsの値が入っていないので取得できない？
  */
  
  //ほかの作品の数は変わらないので、最初にやって終了
//   for(var i =0; i < userSize; i++){
//     addLinkUserWorks(i);
//   }
  
  //おすすめ作品の処理
   setInterval(function(){
     //前回取得したおすすめ作品の数と比較して、違いがあれば追加する
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
    },5000);
  
  $(document).on("click","input",function(){
    $(this).prop("disabled",true);
    var id = $(this).attr("data-check");
    console.log(id);
    var illustId = $(this).attr("id");
    console.log(illustId);
    addBookmark(illustId,id);
  });

});

//ほかの作品に追加
function addLinkUserWorks(i){
    var url = $("._image-items.no-user > .image-item:eq("+i+") > a:last-child").attr("href");
    var position = url.indexOf("id=");
    var id = url.slice(position + 3);
//     $("._image-items.no-user > .image-item:eq("+i+")").append('<a href=http://www.pixiv.net/bookmark_add.php?type=illust&illust_id=' +id+ '>ブックマークに追加</a>');
//     $("._image-items.no-user > .image-item:eq("+i+")").append('<input type=button onclick=addBookmark('+ id +') value=ブックマーク>');
      $("._image-items.no-user > .image-item:eq("+i+")").append('<br><input id='+id+' class='+ "addBookmark" +' type="button" value=ブックマーク data-check='+ i +'>');
}

//おすすめ作品に追加
function addLinkRecommendWorks(i){
    var url = $("._image-items.no-response> .image-item:eq("+i+") > a:eq(1)").attr("href");
    var position = url.indexOf("id=");
    var id = url.slice(position + 3);
    id = id.substring(0,id.indexOf("&")); 
//     $("._image-items.no-response > .image-item:eq("+i+")").append('<br><a class='+ "addBookmark"+' href=http://www.pixiv.net/bookmark_add.php?type=illust&illust_id=' +id+ '>ブックマークに追加</a>');
    $("._image-items.no-response > .image-item:eq("+i+")").append('<br><input id='+id+' class='+ "addBookmark" +' type="button" value=ブックマーク data-check='+ i +'>');
  
    
}

function addBookmark(illustId,id){
  var tag = $("._image-items.no-response > .image-item:eq("+id+") > .work._work > ._layout-thumbnail > ._thumbnail.ui-scroll-view").attr("data-tags");
  
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
      console.log(data);
      console.log("success?");
    },
    error: function(data){
      console.log("error");
    }
   });
}