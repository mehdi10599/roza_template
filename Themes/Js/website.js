var counter = 2,   itemsPerPage = 20 , AllDataCount=0 ,PageActiveLazy=5   , IsRequestSend=0;


function EnableLoadData(){
  var pagenumber= Math.ceil(AllDataCount / itemsPerPage);

  $(window).scroll(function () {
    ////  if ($(window).scrollTop() >= $(document).height() - $(window).height() && counter <=pagenumber) {
    if ( $(window).scrollTop() + $(window).height() >= $(document).height() - $(".product_card").height() && counter <=pagenumber) {
      FilterProduct(5,'',counter,1)

    }else if(pagenumber<counter){
      $(window).off('scroll');
    } 
  });
  $(".pagination .pagination-number a").remove()
  for(var i=1;i<=pagenumber;i=i+1){
    $(".pagination .pagination-number").append(`
<a class="page-number  sp-d-flex sp-center sp-rp-4  sp-pointer   sp-font-xxlarge " page="${i}" onclick="FilterProduct(4,this,${i},0)">${i}</a>
`)}




}

function UpdatePaging(lazyloading=0){
  if(lazyloading==1){
    var t=counter;
    counter++;
    if (counter > PageActiveLazy && lazyloading==1){
      $("[page="+t+"]").addClass("sp-tooltip-image sp-white active-page-number")
      $(window).off('scroll');
      $(".pagination-number").removeClass("sp-d-none")
      $(".pagination-number").addClass("sp-d-flex")

      if(counter!=1)
        $(".pagination-prev").addClass("sp-d-flex")

      if(counter!=$(".page-number").length)
        $(".pagination-next").addClass("sp-d-flex")

    }
  }
}


function appendData(PrString,lazyloading=0) {

  $(".loading-wrapper").fadeOut()

  $("#productlist").append(PrString)
  $("#productlist").removeClass("sp-main-loading")
  /// $('#myScroll').append('<button id="uniqueButton" style="margin-left: 50%; background-color: powderblue;">Click</button><br /><br />');
  UpdatePaging(lazyloading)
}


function FnZmChangevalue(item="weight",isMax=0,CheckMax=0)
{
  let priceGap = 0,
      From=removeComma($("#from"+item).val()),
      To = removeComma($("#to"+item).val()),
      ToMax = parseFloat($(".in-max"+item).attr("max")),
      rangevalue = $(".zr-range-"+item),
      left=0,
      right=0,
      minp = parseFloat(From),
      maxp = parseFloat(To),
      diff = maxp - minp


  if(ToMax<To){
    To=ToMax;
    $("#to"+item).val(separate(ToMax))
    maxp = parseFloat(To)
    diff = maxp - minp
  }

  if (diff < priceGap) {
    if(isMax==0){
      $("#from"+item).val(separate(maxp - priceGap))
      diff=0
      minp = maxp - priceGap
    }
    else {
      if(CheckMax==1){
        $("#to"+item).val(separate(minp + priceGap))
        maxp = minp + priceGap
        diff=0
      }
    }
  } 






  if(isMax==0)
    if (minp > maxp - priceGap) {
      $("#from"+item).val(separate(maxp - priceGap))
      minp = maxp - priceGap;
      diff= maxp - priceGap;
      if (minp < 0) {
        $("#from"+item).val(0)
        minp = 0;
      }
    }

  if (diff >= priceGap && maxp <= parseFloat($(".in-max"+item).attr("max"))) {
    if (isMax==0) {
      $(".in-min"+item).val(minp)
      let value1 = parseFloat($(".in-min"+item).attr("max")) 
      left=(minp / value1) * 100;
      rangevalue.css({"left":left+"%" })
    }
    else {
      $(".in-max"+item).val(maxp)
      let value2 = parseFloat($(".in-max"+item).attr("max")) 
      right = 100 - (maxp / value2) * 100 
      rangevalue.css({"right":right+"%" })
    }
  }
  FilterProduct(1)
}


function showChangevalue(item="weight",itemtype="in-minweight"){

  let priceGap = 0,
      $this = $("."+itemtype),
      ix = $this.val(),
      slide1 = parseFloat(ix),
      i = $this.attr('data-range'),
      rangevalue = $(".zr-range-"+item),left=0,right=0;
  var min='min'+item+'1',max='max'+item+'1';
  let minVal =parseFloat($('['+'data-range='+min+']').val()) , 
      maxVal =parseFloat($('['+'data-range='+max+']').val())  

  let diff = maxVal - minVal

  if (diff < priceGap) {
    if(i=='min'+item+'1'){
      $('['+'data-range='+min+']').val(maxVal - priceGap)
    }
    else {
      $('['+'data-range='+max+']').val(minVal + priceGap)
    }
  }
  else {
    $("."+i+"").val(slide1);
    if(i=='min'+item+'1'){ $("#from"+item).val(separate(slide1));  }
    if(i=='max'+item+'1') { $("#to"+item).val(separate(slide1)); }
    left=(minVal / parseFloat($('['+'data-range='+min+']').attr("max"))) * 100
    right=100 - (maxVal / parseFloat($('['+'data-range='+max+']').attr("max"))) * 100
    rangevalue.css({"left":left+"%" , "right":right+"%"})
  }
}

// Search functionality  
function searchInput(elem,Item="category"){
  var searchTerm = $(elem).val().toLowerCase();  
  if(searchTerm.length==0){
    $('.list-'+Item+' li').addClass("sp-d-flex")
    $('.list-'+Item+' li').removeClass("sp-d-none")
    $(".parent-slide").slideUp(500);
    $(".arrow-left").removeClass("rotate-down")
    $("[searchres='1']").attr("searchres","0") 
  }
  else{
    $('.list-'+Item+' li').each(function() {  
      var itemText = $(this).children(".tree-item-box").text().toLowerCase();  
      if(itemText.indexOf(searchTerm) !== -1){
        $(this).addClass("sp-d-flex");
        $(this).removeClass("sp-d-none");
        $(this).attr("searchres","1")    
      }else{
        $(this).addClass("sp-d-none");
        $(this).removeClass("sp-d-flex");
        $(this).attr("searchres","0")               
      }
    });  

    $("[searchres='1']").each(function(){
      ShowAllChildren($(this))
    });
  }
} 


function changetreeitem(elem){
  var $checkbox = $(elem);  
  var $parent = $(elem).parent(".tree-item-box").parent(".tree-item ")
  var isChecked = $checkbox.is(':checked');  
  if(isChecked){
    if ($checkbox.closest('ul').length > 0) {  
      // Check or uncheck all children  
      $checkbox.closest('li').find('ul input[type="checkbox"]').prop('checked', isChecked);  
      ShowAllChildren($checkbox)
    }  

    $checkbox.parents(".tree-item").each(function(){
      var parentid=$(this).attr("parentid")
      if($(this).siblings().children(".tree-item-box").children("div").children("input:not(:checked)").length==0){
        $("[categoryid="+parentid+"]").prop('checked',true);   
      } 
    })

  }else{
    /*Deactive Children*/
    $($checkbox).parent("div").parent(".tree-item-box").siblings(".parent-slide").find('.tree-item-box input[type="checkbox"]').prop('checked',false);

    /*Deactive parents*/
    $($checkbox).parents(".tree-item").find('>.tree-item-box input[type="checkbox"]').prop('checked',false);
  }
  var s ='';
  $(".tree-checkbox:checked").each(function(){
    s=s+$(this).attr("categoryid")+','
  })
  s=s.slice(0, -1)
  $("#categoryid").val(s).change();

}  

function ShowAllChildren(Parent) {  
  $(Parent).find(".parent-slide").slideDown(500);
  $(Parent).find(".arrow-left").addClass("rotate-down")
  $(Parent).find(".tree-item").addClass("sp-d-flex");
  $(Parent).find(".tree-item").removeClass("sp-d-none");
  $(Parent).find(".tree-item").attr("searchres","1")    
  $(Parent).parents(".tree-item").addClass("sp-d-flex");
  $(Parent).parents(".tree-item").removeClass("sp-d-none");
  $(Parent).parents(".tree-item").attr("searchres","1");
  $(Parent).parents(".tree-item").find(".parent-slide").slideDown(500);
  $(Parent).parents(".tree-item").find(".arrow-left").addClass("rotate-down")
}  


function CreateGridTree(MyArray,elem){
  AppendItems(MyArray,elem);
}

function AppendItems(MyArray,elem) {
  var res = [], TargeyArray = [], Parents = [];
  TargeyArray = $.merge([], MyArray);

  Parents = TargeyArray.filter(obj => obj.Level == 0 &&  obj.Counts > 0 );
  for (var Parentcnt = 0; Parentcnt < Parents.length; Parentcnt++) {
    var str =`<li id="row-${Parents[Parentcnt].Id}" class="tree-item sp-flex-column sp-relative" categoryid="${Parents[Parentcnt].Id}"  parentId="${Parents[Parentcnt].ParentId}"  >  
<div class="sp-d-flex tree-item-box sp-justify-between align-center sp-mb-5 sp-font-normal"  id="parents-${Parents[Parentcnt].Id}">
<div class="sp-d-flex">
<input type="checkbox" class="sp-f-check tree-checkbox categoryid"  id="category-${Parents[Parentcnt].Id}"   categoryid="${Parents[Parentcnt].Id}" parentId="${Parents[Parentcnt].ParentId}"  onchange="changetreeitem(this);">
${Parents[Parentcnt].Title}
</div>
<span class="sp-font-small">${Parents[Parentcnt].Counts}</span>
</div>  
<ul style="display:none;" class="parent-slide parents-${Parents[Parentcnt].Id}">  
</ul>  
</li>`;
    $(elem).append(str);
    AppendItemChildrens(TargeyArray, Parents[Parentcnt].Id);
  }
}

function AppendItemChildrens(Target, ParentId) {
  var Child = [];
  Child = Target.filter(obj => obj.ParentId == ParentId &&  obj.Counts > 0 );

  if(Child.length>0){
    $(`#parents-${ParentId}`).prepend(`<img class="arrow-left min-w-i sp-absolute" onclick="ShowChild(${ParentId},this)" src="/themes/website/Quartz/images/arrow-down.svg" alt="">`)
  }else{
    $(`#parents-${ParentId}`).prepend(`<span class="min-w-i sp-absolute"></span>`)
  }


  for (var Childcnt = 0; Childcnt < Child.length; Childcnt++) {
    var str = `<li id="row-${Child[Childcnt].Id}" class="tree-item sp-flex-column sp-relative" categoryid="${Child[Childcnt].Id}"  parentId="${Child[Childcnt].ParentId}"  >  
<div class="sp-d-flex tree-item-box  sp-justify-between  align-center sp-mb-5 sp-font-normal"  id="parents-${Child[Childcnt].Id}">
<div class="sp-d-flex">
<input type="checkbox" class="sp-f-check tree-checkbox categoryid"  id="category-${Child[Childcnt].Id}"   categoryid="${Child[Childcnt].Id}" parentId="${Child[Childcnt].ParentId}"  onchange="changetreeitem(this);"> 
${Child[Childcnt].Title}
</div>  
<span class="sp-font-small">${Child[Childcnt].Counts}</span>
</div>  

</li>`;
    $(".parents-" + ParentId).append(str);
    if (Target.filter(obj => obj.ParentId == Child[Childcnt].Id).length > 0) {
      AppendItemChildrens(Target, Child[Childcnt].Id);
    }
  }
}

function ShowChild(ParentId,elem){
  $(`.parents-${ParentId}`).slideToggle(500)
  $(elem).toggleClass("rotate-down")
}


function ActiveItems(status=1){
  IsRequestSend=status;
  if(status==1){
    $("input").attr("readonly","readonly")
  }else{
    $("input").removeAttr("readonly","readonly")
  }
}

function resetFilters(){
  IsRequestSend=0
  ShowPage('/fa/products/','divMain')

}

function FilterProduct(Type=0,elem,id,lazyloading=1,HasPaging=0){//Type=0 =>order BY , Type=1 => category , Type2=>Tags,   Type2=>Stones , Type=4 Paging, id=-1=>NextPage , id=-2=>PrevPage 
  if(IsRequestSend==1) return false
  ActiveItems(1)
  if(Type !=4){
    $(".loading-wrapper").fadeIn()
  }

  var orderby=$(".item-orderby.active").attr("orderby")||'' ,
      metaltype=CreateFilterString("metaltype"),
      carat=CreateFilterString("carat"),
      category=CreateFilterString("category"),//$("#categoryid").val(),
      fromweight=removeComma($("#fromweight").val()),toweight=removeComma($("#toweight").val()),
      fromprice=removeComma($("#fromprice").val()),toprice=removeComma($("#toprice").val()),
      fromwage=removeComma($("#fromwage").val()),towage=removeComma($("#towage").val()),
      stone=CreateFilterString("stone"),
      color=CreateFilterString("color"),
      Page=1,//$(".active-page-number").attr("page") ,
      PageLength=$(".page-number").length;
  var firstLoad=0

  if(![4,5].includes(Type)){
    console.warn("Reset")
    counter=1
    $(".pagination-number,.pagination-next,.pagination-prev").removeClass("sp-d-flex")
    $(".pagination-number").addClass("sp-d-none")

    firstLoad=1
  }

  switch(Type){
    case 0:
      orderby=id;
      $(elem).addClass("active")
      $(".item-orderby").not(elem).removeClass("active")
      break;
    case 4:
      Page=$(elem).attr("page") 
      if(id==-1){ 
        Page=$(".active-page-number").attr("page") 
        Page=(Page+1) > $(".page-number").length ? Page : Page + 1 ;
      }
      else if(id==-2){
        Page=$(".active-page-number").attr("page") 
        Page=(Page-1)<1 ? 1 : (Page-1);
      }
      else Page=id;
      break;
    case 5:
      Page=id;
      break;
    default:
      break;
  }

  $(".active-page-number").removeClass("active-page-number  sp-tooltip-image sp-white")
  $("[page="+Page+"]").addClass("active-page-number  sp-tooltip-image sp-white");
  var Fields=`?orderby=${orderby}&metaltype=${metaltype}&carat=${carat}&categoryids=${category}&fromweight=${fromweight}&toweight=${toweight}&fromprice=${fromprice}&toprice=${toprice}&fromwage=${fromwage}&towage=${towage}&StoneIds=${stone}&color=${color}&PageNumber=${Page}&lazyloading=${lazyloading}&Type=${Type}&HasPaging=${HasPaging}&firstLoad=${firstLoad}`

  if(Type!==5){
    $("#productlist").html(``) 
  } 


 /// $("#productlist").addClass("sp-main-loading")
  ShowRefresh(`/fa/products/productlist/`+Fields,'divScript')
  /*    if(lazyloading==1)  else
      ShowRefresh(`/fa/products/productlist/`+Fields,'productlist') */
  $("input[type=checkbox]").parents(".filter-option-list").find(".zr-filter-text").removeClass("zr-span-hasfilter")
  $("input[type=checkbox]:checked").parents(".filter-option-list").find(".zr-filter-text").addClass("zr-span-hasfilter")
}
function CreateFilterString(str){
  var res=''
  $("."+str+"id").each(function(){
    if($(this).is(":checked")){
      res=res+$(this).attr(str+"id")+','
    }
  });
  res=res.slice(0, -1)
  return res;
}



/*Product Details*/
var  weightCounter=0,imageCounter=0

function ShowProductSpecifications(ProductId){
  var Carat=$("#Carat").val(),
      WeightRate=$("#WeightRate").val() ,
      metaltitle=$("#metaltitle").val()
  ShowRefresh(`/fa/product/detail/ProductSpecifications/?ProductId=${ProductId}&Carat=${Carat}&WeightRate=${WeightRate}&metaltitle=${metaltitle}`,'ProductSpecifications');
  ShowRefresh(`/fa/product/detail/StoneList/?ProductId=${ProductId}&Carat=${Carat}&WeightRate=${WeightRate}&metaltitle=${metaltitle}`,'StoneList');
}  


var items = document.querySelectorAll('.product-s-img');  

let currentIndex = 0;  
let selectedIndex = 0; // No item selected initially  

function updateDisplay() {  
  items.forEach((item, index) => {  
    // Show only four items, based on the current index  
    if (index >= currentIndex && index < currentIndex + 4) {  
      item.classList.add('active');  
    } else {  
      item.classList.remove('active');  
    }  
    // Highlight selected item, if any  
    if (index === selectedIndex) {  
      item.classList.add('selected-pic'); 
    } else {  
      item.classList.remove('selected-pic');  
    }  
  });     
  $("#MainProductImg").attr("src",$(".selected-pic img").attr("src"))
}  

function showOverlay(cls){
  $(cls).animate({
    height: 'toggle'
  })
}

function selectItem(index) {  
  selectedIndex = index; // Set selected index  
  updateDisplay(); // Update slider display  
}  

function  prevButton(){  
  if (selectedIndex > 0) {  
    // Select the previous item  
    selectedIndex -= 1;  
  } else {  
    // If at the first item, select the last item  
    selectedIndex = 0;  
  }  

  // Adjust currentIndex if needed to show the selected item  
  if (selectedIndex < currentIndex) {  
    currentIndex = selectedIndex; // Adjust currentIndex to show previous item  
  }  
  updateDisplay();  
}  

function nextButton() {  
  if (selectedIndex < items.length - 1) {  
    // Select the next item  
    selectedIndex += 1;  
  } else {  

    selectedIndex=items.length - 1
  }  

  if (selectedIndex >= currentIndex + 4) {  
    currentIndex = selectedIndex - 3; // Adjust currentIndex to keep the selected item in view  
  }  
  updateDisplay();  
}   

function SelectDropDown(overlay,elem,Parent,valueTarget,titleTarget){

  if($(elem).attr("item-disabled")==1) return false;
  var value=$(elem).attr("ultra-value"),
      title=$(elem).attr("ultra-title"),
      Productid=$(elem).attr("productid"),
      IsExist =$(elem).attr("data-IsExist");

  $(Parent+" :is(.sp-drop-active,.item-selected)").removeClass("sp-drop-active item-selected")
  $(elem).addClass("sp-drop-active")
  $(Parent+' '+valueTarget).html(value)
  $(Parent+' '+titleTarget).html(title)
  $(".sp-drop-items").slideUp(500)
  $(".sp-drop-parent").removeClass("sp-drop-parent-show");
  showOverlay(overlay);
  UpdateProductFeatures(null,3,elem,'.weight-list')
  $("#CartProductId").val(Productid);



}

var iproductId=$("#productId").val();
$("#CartProductId").val(iproductId);

function ToggleDropDown(elem){
  $("."+elem).slideToggle('500', function() {
    if ($(this).is(':visible'))
      $(this).parents(".sp-drop-parent").addClass("sp-drop-parent-show");
    else{
      $(this).parents(".sp-drop-parent").removeClass("sp-drop-parent-show");
    }
  })
}

$(document).mouseup(function(e){
  var container = $(".sp-drop-parent")
  if (!container.is(e.target) && container.has(e.target).length === 0 ) 
  {
    $(container).find(".sp-drop-items").slideUp(500);
    $(".sp-drop-parent").removeClass("sp-drop-parent-show");
  } 
});


function UpdateProductFeatures(overlay,type,selector,parent,BaseProductId=-1) { //type=0 => color , type=1 => size , type=>2 => stone  , type=>3 => weight ,type=>10 => FirstLoad  
  showOverlay(overlay)
  if($(selector).attr("item-disabled")==1) return false;

  $(parent+" .item").not($(selector)).removeClass("item-selected");
  $(selector).addClass("item-selected") 

  var color=(type==0) ? 1 : 0, size=(type==1) ? 1 : 0,stone=(type==2) ? 1 : 0,weight=(type==3) ? 1 : 0;
  var productId =(type==10) ? BaseProductId+'' : $(selector).attr("productId") , ItemproductId,mainProductId=productId ,productIdDemo=productId;
  BaseProductId=productId ///  var productIdlist = productId.split(",")


  if(type==10){
    color=3, size=3,stone=3,weight=3;

  } 

  if(type==1){
    color=2
  }else if(type==2){
    size=2; 
    color=2;
  }else if(type==3){
    color=2;
    stone=2;
  }

  var colorlist=(color==2) ? $(".color-list .item-selected").attr("productId") || '' : '' 
  var sizelist=(size==2) ? $(".size-list .item-selected").attr("productId") || '' : '' 
  var stonelist=(stone==2) ? $(".stone-list .item-selected").attr("productId") || '' : ''


  if(color==2){ 
    productIdDemo= (colorlist.length>0) ? Ismatch(productId,colorlist,1) : productIdDemo
    productIdDemo=productIdDemo.toString();
  }
  if(size==2){ 
    productIdDemo= (sizelist.length>0) ? Ismatch(productIdDemo,sizelist,1) :  productIdDemo 
    productIdDemo=productIdDemo.toString();
  }
  if(stone==2){  
    productIdDemo= (stonelist.length>0) ? Ismatch(productIdDemo,stonelist,1) :  productIdDemo
    productIdDemo=productIdDemo.toString();
  }

  productId=productIdDemo
  BaseProductId=productId
  $("#CartProductId").val(productId)
  
  /// productIdlist = productId.split(",");


  if([0,3].includes(color)){
    $(".color-list .item-disabled ,.color-list.item-selected").removeClass("item-disabled item-selected") 
    $(".color-list .item-disabled").removeAttr("item-disabled") 

    $(".color-list .item").each(function(){
      ItemproductId= $(this).attr("productId")
      if(Ismatch(BaseProductId,ItemproductId)==1){
        $(".color-list .item.item-selected").removeClass("item-selected") 
        $(this).addClass("item-selected") 
        color=(type!=10) ? 1 : 3
        $(this).removeAttr("item-disabled") 
      }
    })
    if(color==3){
      productId=$(".color-list .item-selected").attr("productId") || '' 
      productIdDemo=productId
    }
  }


  //select size
  if([0,3].includes(size)){
    $(".size-list .item-disabled ,.size-list.item-selected").removeClass("item-disabled item-selected") 
    $(".size-list .item-disabled").removeAttr("item-disabled") 

    $(".size-list .item").each(function(){


      ItemproductId= $(this).attr("productId")
      if(Ismatch(productId,ItemproductId)==1){

        if(type==10){
          if(Ismatch(BaseProductId,ItemproductId)==1){
            $(".size-list .item.item-selected").removeClass("item-selected") 
            $(this).addClass("item-selected") 
            size=1
          }
        }
        else{
          if(size==0)  
          {
            $(".size-list .item.item-selected").removeClass("item-selected") 
            $(this).addClass("item-selected") 
            size=1
          }
        }   

        $(this).removeAttr("item-disabled") 
      }else{
        $(this).removeClass("item-selected") 
        $(this).addClass("item-disabled") 
        $(this).attr("item-disabled",1) 
      }
      //if(size==1)  return false;
    })

    sizelist=$(".size-list .item-selected").attr("productId") || '' 
    productIdDemo= (sizelist.length>0) ? Ismatch(productIdDemo,sizelist,1) :  productIdDemo 
    productId = productIdDemo.toString();
    productIdDemo=productId
    /// productIdlist = productId.split(",");
  }

  //select stone
  if([0,3].includes(stone)){
    $(".stone-list .item-disabled ,.stone-list.item-selected").removeClass("item-disabled item-selected") 
    $(".stone-list .item-disabled").removeAttr("item-disabled") 
    $(".stone-list .item").each(function(){
      ItemproductId=$(this).attr("productId")
      if(Ismatch(productId,ItemproductId)==1){
        if(type==10){
          if(Ismatch(BaseProductId,ItemproductId)==1){
            $(".stone-list .item.item-selected").removeClass("item-selected") 
            $(this).addClass("item-selected") 
            stone=1
          }
        }
        else{
          if(stone==0){
            $(".stone-list .item.item-selected").removeClass("item-selected") 
            $(this).addClass("item-selected") 
            stone=1
          }
        }
        $(this).removeAttr("item-disabled") 
      }else{
        $(this).removeClass("item-selected") 
        $(this).addClass("item-disabled") 
        $(this).attr("item-disabled",1) 
      }
      //  if(stone==1)  return false;
    })

    stonelist=$(".stone-list .item-selected").attr("productId") || '' 
    productIdDemo= (stonelist.length>0) ? Ismatch(productIdDemo,stonelist,1) :  productIdDemo 
    productId = productIdDemo.toString();
    productIdDemo=productId
  }

  //select weight
  if([0,3].includes(weight)){//&& type!=10
    $(".weight-list .item-disabled ,.stone-list.item-selected").removeClass("item-disabled item-selected") 
    $(".weight-list .item-disabled").removeAttr("item-disabled") 

    $(".weight-list .sp-drop-item ").each(function(){
      ItemproductId=$(this).attr("productId")
      if(Ismatch(productId,ItemproductId)==1){
        if(type==10){
          if(Ismatch(BaseProductId,ItemproductId)==1){
            $(".weight-list .sp-drop-item.sp-drop-active").removeClass("sp-drop-active") 
            // $(this).click()
            mainProductId=ItemproductId
            weight=1
            $(".weight-list .sp-drop-item[productId='"+mainProductId+"']").addClass("sp-drop-active") 
            $("#_ProductWeight #Weight").text($(".weight-list .sp-drop-item[productId='"+mainProductId+"']").attr("ultra-value"))
            $("#_ProductWeight #Pcode").text($(".weight-list .sp-drop-item[productId='"+mainProductId+"']").attr("ultra-title"))     
          }
        }
        else{
          if(weight==0){ 
            $(".weight-list .sp-drop-item.sp-drop-active").removeClass("sp-drop-active") 
            // $(this).click()
            mainProductId=ItemproductId
            weight=1
            $(".weight-list .sp-drop-item[productId='"+mainProductId+"']").addClass("sp-drop-active") 
            $("#_ProductWeight #Weight").text($(".weight-list .sp-drop-item[productId='"+mainProductId+"']").attr("ultra-value"))
            $("#_ProductWeight #Pcode").text($(".weight-list .sp-drop-item[productId='"+mainProductId+"']").attr("ultra-title"))     
          }
        }
        $(this).removeAttr("item-disabled") 
      }else{
        $(this).removeClass("item-selected") 
        $(this).addClass("item-disabled") 
        $(this).attr("item-disabled",1) 
      }
      //if(weight==1)  return false;
    })
  }

  ShowProductSpecifications(mainProductId)
  $("[colorclass]").attr("colorclass",$(".color-list .item-selected").attr("colorname"))
  $("#colorText , .colorText").text($(".color-list .item-selected").text());
  $("#sizeText , .sizeText" ).text($(".size-list .item-selected").text());
  $("#stoneText , .stoneText").text($(".stone-list .item-selected").text());
  $("#weightText , .weightText ").text($("#_ProductWeight #Weight").text());
}


function Ismatch(a,b,IsArray=0){
  const list1 = a.split(',');  
  const list2 = b.split(',');  
  const matches = list1.filter(number => list2.includes(number));  
  if(IsArray==1)
    return  matches
  else
    return  (matches.length>0) ? 1 : 0
}

function ToggleFilters(Parent,Item,Icon){
  $(Parent+' '+Item).slideToggle(500);
  $(Icon).toggleClass("rotate-reverse")
}


function removeComma(str){
  if(str!=null && str!='undefined' && str !='')
    return str.replaceAll(',','');
  else
    return null;
}

function separate(number) {
  var decimalPlaces=0
  number = String(number).replace(/[^0-9.]/g, ''); //Remove non-numeric chars except '.'  
  // Input validation: Check for non-numeric characters and negative numbers  
  if (isNaN(number) || number < 0 || typeof decimalPlaces !== 'number' || decimalPlaces < 0) {  
    return "Invalid input"; //Or throw an error: throw new Error("Invalid input");  
  }  

  number = String(number).replace(/,/g, '');  
  const [integerPart, decimalPart] = number.split('.');  

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');  

  let formattedDecimal = "";  
  if (decimalPart) {  
    formattedDecimal = "." + decimalPart.substring(0, decimalPlaces); //Limit decimal places  

    //Remove trailing zeros if decimalPlaces is specified and there are any  
    if(decimalPlaces > 0) formattedDecimal = formattedDecimal.replace(/0+$/, '').replace(/\.$/, '');  

  }  


  return decimalPlaces === 0 ? formattedInteger : `${formattedInteger}${formattedDecimal}`;  
} 


/*-------Cart-----*/
function AddToCart()
{
  var CartProductId = $("#CartProductId").val();
  ShowRun('/AddToCart/?CartProductId='+CartProductId+'','DivAddToCart')
}

