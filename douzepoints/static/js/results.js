"use strict";
$("#json").click((event) => {
    var data = JSON.stringify(votes);
    downloadFile(data, 'application/json;charset=utf-8', `${cname}-results.json`);
});
$('#csv').click(() => {
    var data = tableToCSV($('table'));
    downloadFile(data, 'text/csv;charset=utf-8', `${cname}-results.csv`);
});
function downloadFile(data, type, filename) {
    var csvFile = new Blob([data], { type: type });
    var urlObject = window.URL.createObjectURL(csvFile);
    var downloadLink = $('<a />', {
        download: filename,
        href: urlObject,
        style: 'display: none;'
    })[0];
    $('body').append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.URL.revokeObjectURL(urlObject);
}
function tableToCSV(table) {
    var csv = [];
    table.each((_, row) => {
        var rows = [];
        $(row).find('td, th').each((_, column) => {
            rows.push($(column).text());
        });
        csv.push(rows.join(','));
    });
    return csv.join('\n');
}
function createTable(contestants, votes) {
    var table = $('<table />').appendTo($('body'));
    var header = $('<tr />');
    table.append(header.append($('<th />').text('Contestant')));
    contestants.forEach(c => table.append($('<tr />', { id: c }).append($('<td />').text(c))));
    votes.forEach(v => {
        $(header).append($('<th />').text(v.name));
        table.children().each((data, row) => {
            var c = $(row).attr('id');
            if (!data)
                return;
            if (c in v.votes)
                $(row).append($('<td />').text(v.votes[c]));
            else
                $(row).append($('<td />'));
        });
    });
}
createTable(contestants, votes);
//# sourceMappingURL=results.js.map