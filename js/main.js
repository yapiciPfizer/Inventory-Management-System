$(document).ready(function () {
    w3.includeHTML();

    var loadedInterval = setInterval(function () {
        if ($('.search-elements-wrapper').length) {
            webPartsLoaded();
            clearInterval(loadedInterval);
        }
    }, 200);

    $(function () {
        $('html').on('focus', '[placeholder]', function () {
            var input = $(this);
            if (input.val() === input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
                input.css('color', '#1C4D6F');
                input.css('font-family', "'AlegreyaSans', sans-serif");
            }
        });

        $('html').on('blur', '[placeholder]', function () {
            var input = $(this);
            if (input.val() === '' || input.val() === input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
                input.css('color', '#aaaaaa');
                input.css('font-family', "'AlegreyaSans', sans-serif");
            } else {
                input.css('color', '#1C4D6F');
                input.css('font-family', "'AlegreyaSans', sans-serif");
            }
        });
    });
});

function webPartsLoaded() {
    populateTable();
    getPerson();
    preparePlaceholders();
    adjustShadows();

    function preparePlaceholders() {
        $('[placeholder]').blur();
    }
    
    function adjustShadows() {
        var shadow = $(".shadow");
        shadow.each(function() {
            var currentShadow = $(this);
            if(currentShadow.is("tr")) {
                currentShadow.find('th').attr('colspan', currentShadow.parent().find("tr:first-child th").length);
            }
        });
    }
}

var siteUrl = '/sites/BiosimsPS-Denosumab/ARD/';

function createListItem() {

    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle('Test');

    var itemCreateInfo = new SP.ListItemCreationInformation();
    this.oListItem = oList.addItem(itemCreateInfo);

    oListItem.set_item('MaterialName', 'PF-123456 DP');
    oListItem.set_item('Manufacturer', 'In-House/PBDC');
    oListItem.set_item('LotNo', 'PBDC Molecule-000123');
    oListItem.set_item('Quantity', '50');
    oListItem.set_item('StorageAssetID', 'HSP123456');

    oListItem.update();

    clientContext.load(oListItem);

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
}

function onQuerySucceeded() {
    populateTable();
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
}


function showPopup() {
    $(".popup-window").fadeIn();
    $("#gray-out-div").fadeIn();
}

function hidePopup() {
    $(".popup-window").fadeOut();
    $("#gray-out-div").fadeOut();
}

function populateTable() {
    var apiBaseUrl = "/_api/web/lists/getbytitle('Test')/items";
    var apiQueryUrl = "?";
    apiQueryUrl += "$select=Title,ID,MaterialName,Manufacturer,LotNo,Quantity,StorageAssetID";
//apiQueryUrl += "&$filter=(((ID eq 1) or (ID eq 2)) and (substringof('engin',Author)))";
    apiQueryUrl += "&$filter=substringof('engin',Author)";
    apiQueryUrl += "&$orderby=ID desc";

    $.ajax({
        url: siteUrl + apiBaseUrl + apiQueryUrl,
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"},
        success: function (data) {
            var results = data.d.results;
            var numOfValues = results.length;
            var returnHtml = "";

            for (var i = 0; i < numOfValues; i++) {
                returnHtml += "<tr>";
                returnHtml += "<td>" + results[i]['MaterialName'] + "</td>";
                returnHtml += "<td>" + results[i]['Manufacturer'] + "</td>";
                returnHtml += "<td>" + results[i]['LotNo'] + "</td>";
                returnHtml += "<td>" + results[i]['Quantity'] + "</td>";
                returnHtml += "<td>" + results[i]['StorageAssetID'] + "</td>";
                returnHtml += "</tr>";

            }

            $("#inventory-table").find("tbody").html(returnHtml);
        },
        error: function (data) {
            alert("Error: " + data);
        }
    });
}

function getPerson() {
    $.ajax({
        url: siteUrl + "/_api/web/siteusers?$select=Id,Title,Email,LoginName,IsSiteAdmin&$filter=substringof('Yapici', Title)",
        method: "GET",
        headers: {"Accept": "application/json; odata=verbose"},
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            alert("Error: " + data);
        }
    });
}

