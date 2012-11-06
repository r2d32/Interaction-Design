$(function() {
    $( "#selectable" ).selectable({
        stop: function() {
            var result = $( "#select-result" ).empty();
            $( ".ui-selected", this ).each(function() {
                var index = $( "#selectable li" ).index( this );
                result.append( "Project number " + ( index + 1 ) );
            });
        }
    });
});