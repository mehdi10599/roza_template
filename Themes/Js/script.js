    $(document).ready(function() {

        // toggle basket
        $(".zr-header-basket-main").hide();
        $(".zr-header-basket").on("click", function() {
            $(".zr-header-basket-main").toggle();
        });
        $(".zr-header-basket-main").on("click", function(event){
            event.stopPropagation();
        });

        //search bar toggle
        $(".zr-header-search").on("click",function(){
            $(".zr-header-search").toggleClass("zr-search-active");
        });
        $(".zr-header-search > input").on("click",function(event){
            event.stopPropagation();
        });


        // basket close btn
        $(".zr-basket-buttons > a:nth-child(2)").on("click",function(){
            $(".zr-header-basket-main").toggle();
        });
    });