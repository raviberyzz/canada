$(document).ready(function () {

//Comparison table Analytics starts here//

$('.getting-started-icon-wrapper .icon-texts a').click(function(){
    value=$(this).text().toLowerCase();
	//alert(value);
    if (value == 'compare life insurance products'|| value == 'comparer les types d’assurance-vie'){
    	utag.link({
            "ev_action"		: "onpage_impr",
  			"ev_title"		: "compare life insurance products modal open",
  			"ev_type"		: "other"
        });
    }
    else if(value == 'compare term life insurance products' || value == 'comparer les produits d\'assurance-vie temporaire'){
        utag.link({
            "ev_action"		: "onpage_impr",
  			"ev_title"		: "compare term life insurance products modal open",
  			"ev_type"		: "other"
        });
    }
    else if(value == 'compare permanent life insurance products' || value == 'comparer les produits d’assurance-vie permanente'){
        utag.link({
            "ev_action"		: "onpage_impr",
  			"ev_title"		: "compare permanent life insurance products modal open",
  			"ev_type"		: "other"
        });

    }

    });	
//Comparison table Analytics ends here//  

});
