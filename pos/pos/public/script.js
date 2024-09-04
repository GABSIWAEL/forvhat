// ---------Responsive-navbar-active-animation-----------
function test(){
    var tabsNewAnim = $('#navbarSupportedContent');
    var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
        "top":itemPosNewAnimTop.top + "px",
        "left":itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent").on("click","li",function(e){
        $('#navbarSupportedContent ul li').removeClass("active");
        $(this).addClass('active');
        var activeWidthNewAnimHeight = $(this).innerHeight();
        var activeWidthNewAnimWidth = $(this).innerWidth();
        var itemPosNewAnimTop = $(this).position();
        var itemPosNewAnimLeft = $(this).position();
        $(".hori-selector").css({
            "top":itemPosNewAnimTop.top + "px",
            "left":itemPosNewAnimLeft.left + "px",
            "height": activeWidthNewAnimHeight + "px",
            "width": activeWidthNewAnimWidth + "px"
        });
    });
}
$(document).ready(function(){
    setTimeout(function(){ test(); });
});
$(window).on('resize', function(){
    setTimeout(function(){ test(); }, 500);
});
$(".navbar-toggler").click(function(){
    $(".navbar-collapse").slideToggle(300);
    setTimeout(function(){ test(); });
});



// --------------add active class-on another-page move----------
jQuery(document).ready(function($){
    // Get current path and find target link
    var path = window.location.pathname.split("/").pop();

    // Account for home page with empty path
    if ( path === '' ) {
        path = 'index.html';
    }

    var target = $('#navbarSupportedContent ul li a[href="'+path+'"]');
    // Add active class to target link
    target.parent().addClass('active');
});




// Add active class on another page linked
// ==========================================
// $(window).on('load',function () {
//     var current = location.pathname;
//     console.log(current);
//     $('#navbarSupportedContent ul li a').each(function(){
//         var $this = $(this);
//         // if the current path is like this link, make it active
//         if($this.attr('href').indexOf(current) !== -1){
//             $this.parent().addClass('active');
//             $this.parents('.menu-submenu').addClass('show-dropdown');
//             $this.parents('.menu-submenu').parent().addClass('active');
//         }else{
//             $this.parent().removeClass('active');
//         }
//     })
// });

document.addEventListener('DOMContentLoaded', () => {
    // Attach click event listeners to navbar items
    document.getElementById('Dashboard-link').addEventListener('click', () => loadComponent('Dashboard'));
    document.getElementById('Customers-link').addEventListener('click', () => loadComponent('Customers'));
    document.getElementById('Products-link').addEventListener('click', () => loadComponent('Products'));
    document.getElementById('Reports-link').addEventListener('click', () => loadComponent('Reports'));
    document.getElementById('Sales-link').addEventListener('click', () => loadComponent('Sales'));
   document.getElementById('Operations-link').addEventListener('click', () => loadComponent('Operations'));
  //  document.getElementById('documents-link').addEventListener('click', () => loadComponent('Documents'));
});

// Function to load the content of a component
let salesEventListenersRemoved = false;

function removeSalesEventListeners() {
    if (!salesEventListenersRemoved) {
        const addNewCustomerButton = document.getElementById('add-new-customer');
        const finalizeSaleButton = document.getElementById('finalize-sale');

        if (addNewCustomerButton) {
            addNewCustomerButton.removeEventListener('click', toggleNewCustomerFields);
        }

        if (finalizeSaleButton) {
            finalizeSaleButton.removeEventListener('click', processSale);
        }

        salesEventListenersRemoved = true;
    }
}

function loadComponent(componentName) {
    fetch(`components/${componentName}Component.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;

            if (componentName === 'Products') {
                loadProductsComponent(); // Initialize the products script after loading
            }
            if (componentName === 'Customers') {
                loadCustomersComponent();
            }
            if (componentName === 'Sales') {
                removeSalesEventListeners(); // Cleanup old listeners if necessary
                loadAvailableProducts();
                loadCustomers();
                const addNewCustomerButton = document.getElementById('add-new-customer');
                const finalizeSaleButton = document.getElementById('finalize-sale');

                if (addNewCustomerButton) {
                    addNewCustomerButton.addEventListener('click', () => toggleNewCustomerFields());
                }

                if (finalizeSaleButton) {
                    finalizeSaleButton.addEventListener('click', processSale);
                }

            }
        })
        .catch(error => console.error('Error loading component:', error));
}

