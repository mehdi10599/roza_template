    $(document).ready(function() {
        // alert('hello')
        let w = window.innerWidth;
        // alert('width :'+w);
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





        //hamber menu
        $(".zr-hamber-menu-icon,.zr-hamber-menu-close").on("click",function(e){
            $(".zr-hamer-container-fixed ,.zr-hamber-menu-icon").toggleClass("zr-collapse");
            $(".zr-hamber-menu-close").toggleClass("zr-active");
        });
        
        //mahsoolat
        $(".zr-hamber-container>a:nth-child(2)").on("click",function(e){
            $(".zr-mahsoolat-arrow").toggleClass("zr-rotate");
            $(".zr-hamber-submenu ").toggle();
        });

        //submenu
        $(".zr-hamber-submenu-items").on("click",function(event){
            event.stopPropagation();
            $(this).find("ul.zr-hamber-submenu-item").toggleClass("zr-collapse");
            $(this).find(".zr-sub-arrow").toggleClass("zr-rotate");
        });
        
        $(".zr-hamber-submenu-item ").on("click",function(event){
            event.stopPropagation();
        });
        

        //slider main
        let sliderSrcs=[];
        $(".mainslider").each(function(index){
            sliderSrcs.push($(this).attr('src'));
        });
        console.log(sliderSrcs);
        let length = sliderSrcs.length;
        setInterval(function(){
            $.when($(".mainslider").fadeOut(800)).then(function() {
                let first = sliderSrcs[0];
                sliderSrcs.shift();
                sliderSrcs.push(first);
                console.log(sliderSrcs);
                for (let i = 0; i < sliderSrcs.length; i++) {
                    $(".mainslider").eq(i).attr('src', sliderSrcs[i]);
                }
                $(".mainslider").fadeIn(800);
            });
        },5000);


    });