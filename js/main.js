$(document).ready(function () {
    w3.includeHTML();

    var loadedInterval = setInterval(function () {
        if ($('.search-elements-wrapper').length) {
            webPartsLoaded();
            clearInterval(loadedInterval);
        }
    }, 200);
});

function webPartsLoaded() {
    populateTable();
    preparePlaceholders();
    adjustShadows();

    function preparePlaceholders() {

        var fontFamily = $('html').css('font-family');

        $(function () {
            $('html').on('focus', '[placeholder]', function () {
                var input = $(this);
                if (input.val() === input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                    input.css('color', '#1C4D6F');
                    input.css('font-family', fontFamily);
                }
            });

            $('html').on('blur', '[placeholder]', function () {
                var input = $(this);
                if (input.val() === '' || input.val() === input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                    input.css('color', '#aaaaaa');
                    input.css('font-family', fontFamily);
                } else {
                    input.css('color', '#1C4D6F');
                    input.css('font-family', fontFamily);
                }
            });
        });

        $('[placeholder]').blur();
    }

    function adjustShadows() {
        var shadow = $(".shadow");
        shadow.each(function () {
            var currentShadow = $(this);
            if (currentShadow.is("tr")) {
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

MiscFunctions = (function () {

    function prepareTableCell(value) {
        return "<td><input value='" + value + "'/></td>";
    }

    function prepareTableRows(array, keys) {
        var returnHtml = "";

        for (var i = 0, max = array.length; i < max; i++) {
            returnHtml += "<tr>";
            for (var j = 0, m = keys.length; j < m; j++) {
                returnHtml += prepareTableCell(array[i][keys[j]]);
            }
            returnHtml += "</tr>";
        }

        return returnHtml;
    }

    return {
        prepareTableCell: prepareTableCell,
        prepareTableRows: prepareTableRows
    }
})();

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
            var keys = ['MaterialName', 'Manufacturer', 'LotNo', 'Quantity', 'StorageAssetID']

            $("#inventory-table").find("tbody").html(MiscFunctions.prepareTableRows(data.d.results, keys));
        },
        error: function (data) {
            alert("Error: " + data);
        }
    });
}

Items = (function () {

    var isNewItemSaved = true;

    function addNew() {
        var inventoryTableBody = $("#inventory-table").find('tbody');

        if (isNewItemSaved) {
            var numberOfCells = inventoryTableBody.find('tr:first-child td').length;

            var emptyRow = "<tr>";
            for (var i = 0; i < numberOfCells; i++) {
                emptyRow += MiscFunctions.prepareTableCell("");
            }
            emptyRow += "</tr>";

            inventoryTableBody.html(emptyRow + inventoryTableBody.html());

            isNewItemSaved = false;
        }

        inventoryTableBody.find("tr:first-child td:first-child input").focus();
    }

    return {
        addNew: addNew
    }
})();

Users = (function () {
    var currentUserId = getCurrentUserId();
    
    getUser('Yapici, Engin');

    function getCurrentUserId() {
        var apiBaseUrl = "/_api/web/CurrentUser?$select=Id";

        $.ajax({
            url: siteUrl + apiBaseUrl,
            method: "GET",
            headers: {"Accept": "application/json; odata=verbose"},
            success: function (data) {
//                console.log(data);
            },
            error: function (data) {
                alert("Error: " + data);
            }
        });
    }

    function getUser(name) {
        $.ajax({
            url: siteUrl + "/_api/web/siteusers?$select=Id,Title,Email,LoginName,IsSiteAdmin&$filter=substringof('" + name + "', Title)",
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

})();
