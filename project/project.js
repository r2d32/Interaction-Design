$(function() {
    $( "#selectable" ).selectable({
        stop: function() {
            var result = $( "#select-result" ).empty();
            $( ".ui-selected", this ).each(function() {
                var index = $( "#selectable li" ).index( $( ".ui-selected" ));
                result.append( "Project number " + ( index + 1 ) );
            });
        }
    });
});