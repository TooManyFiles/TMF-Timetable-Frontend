new MultiSelect('#dynamic', {
            data: [
                {
                    value: 'opt1',
                    text: 'Option 1'
                },
                {
                    value: 'opt2',
                    html: 'Option 2'
                },
                {
                    value: 'opt3',
                    text: 'Option 3'
                },
                {
                    value: 'opt4',
                    text: 'Option 4'
                },
                {
                    value: 'opt5',
                    text: 'Option 5'
                }
            ],
            placeholder: 'Wähle deine Fächer / Kurse aus',
            search: true,
            selectAll: true,
            listAll: true,
            onChange: function(value, text, element) {
                console.log('Change:', value, text, element);
            },
            onSelect: function(value, text, element) {
                console.log('Selected:', value, text, element);
            },
            onUnselect: function(value, text, element) {
                console.log('Unselected:', value, text, element);
            }
});