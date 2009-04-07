// Call this function when the page has been loaded
function initGMAP(mapId, show) {
    if(!show) {
        show = [ 'conference', 'special', 'hotel', 'hotel_conv' ];
    }
    var places = [
        {
            'name': 'Hotel Laurus',
            'description': '<p>L\'Hotel Laurus ospita i tre giorni della conferenza</p>',
            'coordinate': new google.maps.LatLng(43.7734241, 11.2526663),
            'type': 'conference'
        }
    ];
    var pyconIcon = new GIcon(G_DEFAULT_ICON);
    pyconIcon.image = "{{ MEDIA_URL }}p3/i/marker_pycon.png";
    var hotelIcon = new GIcon(G_DEFAULT_ICON);
    hotelIcon.image = "{{ MEDIA_URL }}p3/i/marker_hotel.png";
    var hotelCIcon = new GIcon(G_DEFAULT_ICON);
    hotelCIcon.image = "{{ MEDIA_URL }}p3/i/marker_hotel_conv.png";

    $(document).unload(function() { google.maps.Unload() });
    var map = new google.maps.Map2(document.getElementById(mapId));
    map.setCenter(places[0]['coordinate'], 15);
    map.setUIToDefault();
    function addConferencePlaceMarker() {
        if($.inArray(this.type, show) == -1)
            return;
        var marker = new google.maps.Marker(
            this.coordinate, {title: this.name, icon: pyconIcon});
        map.addOverlay(marker);
        marker.bindInfoWindowHtml(this.description);
    }
    function addHotelMarker() {
        var htype = this.affiliated ? 'hotel_conv' : 'hotel';
        if($.inArray(htype, show) == -1)
            return;
        var point = new google.maps.LatLng(this.lat, this.lng);
        var marker = new google.maps.Marker(point, { icon: this.affiliated ? hotelCIcon : hotelIcon });
        map.addOverlay(marker);
        var d = '';
        d += '<div class="info-hotel">';
        d += '<h1>' + this.name + ' <a href="#h-' + this.id + '">&rarr;</a></h1>';
        d += '<table>';
        if(this.telephone)
            d += '<tr><th>Telefono:</th><td>' + this.telephone + '</td></tr>';
        if(this.email)
            d += '<tr><th>Email:</th><td><a href="mailto:' + this.email+ '">' + this.email + '</a></td></tr>';
        if(this.url)
            d += '<tr><th>Sito web:</th><td><a href="' + this.url+ '">' + this.url + '</a></td></tr>';
        d += '<tr><th>Prezzo:</th><td>' + this.price + '</td></tr>';
        d += '</table>';
        d += '<br /><br />';
        d += '</div>';
        marker.bindInfoWindowHtml(d);
    }
    $.each(places, addConferencePlaceMarker);
    $.getJSON('/conference/hotels/', function(data) {
        $.each(data, addHotelMarker);
    });
}
