(function() {
    'use strict';

    var selected = {
        textWidth: 0
    };

    selected.create = function(select) {
        var container = document.createElement('div'),
            searchBox = document.createElement('input'),
            activeList = document.createElement('ul'),
            optionsList = document.createElement('ul'),
            options = select.querySelectorAll('option'),
            multiple = select.multiple || false;

        // Inherit the targets classes
        container.className = select.className;
        container.classList.add('selected');

        // Define the selected-type
        if (multiple)
            container.classList.add('selected-multiple');
        else
            container.classList.add('selected-single');

        optionsList.className = 'selected-options';
        activeList.className = 'selected-active';

        // Hide the select & options list
        select.style.display = 'none';
        optionsList.style.display = 'none';

        // Moves the option list up/down inline with the active list's height
        var moveOptionList = function() {
            optionsList.style.marginTop = activeList.offsetHeight + 'px';
            optionsList.style.width = activeList.offsetWidth + 'px';
        };

        var onFocus = function() {
            optionsList.style.display = 'block';
            activeList.classList.add('focus');
        }

        container.addEventListener('click', function(ev) {
            if (!activeList.classList.contains('focus')) {
                onFocus();
                moveOptionList();
                searchBox.focus();
            }
        });

        // Bind up the search box
        searchBox.addEventListener('focus', function(ev) {
            onFocus();
        });
        searchBox.addEventListener('blur', function(ev) {
            optionsList.style.display = 'none';
            activeList.classList.remove('focus');
        });

        // Stops clicks on the option list & container propagating to blur searchBox
        container.addEventListener('mousedown', function(ev) {
            ev.preventDefault();
        });
        optionsList.addEventListener('mousedown', function(ev) {
            ev.preventDefault();
        });

        // Filter options list by searchbox results
        var filterSearch = function(ev) {
            var regex = new RegExp(searchBox.value, 'i'),
                targets = optionsList.querySelectorAll('li');

            for (var i=0; i<targets.length; i++) {
                var target = targets[i];

                // With multiple active options are never shown in the options list, with single
                // we show both the active/inactive options with the active highlighted
                if(multiple && target.classList.contains('active'))
                    continue;

                if(!target.textContent.match(regex)) {
                    target.style.display = 'none';
                } else {
                    target.style.display = 'block';
                }
            };

            searchBox.style.width = ((searchBox.value.length * selected.textWidth) + 25) + 'px';
            moveOptionList();
        };
        searchBox.addEventListener('keyup', filterSearch);

        // Create "deselected" option
        // this is here because we _always_ have a full list of items in the optionList
        // basically this means when we deselect something, it will always return to the
        // original list position, rather than appending to the end
        var createDeselected = function(option, selected) {
            var item = document.createElement('li');
            item.textContent = option.textContent;

            var activate = function() {
                // If multiple we just remove this option from the list
                if (multiple) {
                    item.style.display = 'none';

                // If single ensure no other options are selected, but keep in the list
                } else {
                    for (var i=0; i<options.length; i++) {
                        if (options[i]._deselected)
                            options[i]._deselected.classList.remove('active');
                    }
                }

                item.classList.add('active');

            }

            item.addEventListener('click', function(ev) {
                activate();
                selectOption(option); // create "selected" option
            });

            if (selected) {
                activate();
            }

            optionsList.appendChild(item);
            option._deselected = item;
        };

        var selectOption = function(option) {
            option.selected = true;

            // Clear & reload dropdown filter
            if (searchBox.value && searchBox.value !== '') {
                searchBox.value = '';
                filterSearch();
            }

            // Create "selected" option
            var item = document.createElement('li');
            item.textContent = option.textContent;

            // If multiple we allow clicking on the item to remove it
            if (multiple) {
                item.addEventListener('click', function(ev) {
                    ev.stopPropagation();
                    activeList.removeChild(item); // remove this "selected" option
                    deselectOption(option); // create "deselected" option
                });

                // Stops removals from unfocusing the searchBox
                item.addEventListener('mousedown', function(ev) {
                    ev.preventDefault();
                });

                activeList.insertBefore(item, searchBox);

            // Single can only have one, non-clickable option at once
            } else {
                activeList.innerHTML = '';
                activeList.appendChild(item);
            }

            if(!option._deselected) {
                createDeselected(option, true);
            }

            // Move the optionList accordingly
            moveOptionList();
        };

        var deselectOption = function(option) {
            option.selected = false;

            if(option._deselected) {
                option._deselected.style.display = 'block';
                option._deselected.classList.remove('active');
            } else {
                createDeselected(option);
            }

            // Reload dropdown filter
            if (searchBox.value && searchBox.value !== '') {
                filterSearch();
            }

            // Move the optionList accordingly
            moveOptionList();
        };

        // Attach search box & options list
        if (multiple)
            activeList.appendChild(searchBox);
        else
            optionsList.appendChild(searchBox);

        container.appendChild(optionsList);
        container.appendChild(activeList);

        // Stick the whole thing just before our select
        select.parentNode.insertBefore(container, select);

        // Make select options -> list
        for(var j=0; j<options.length; j++) {
            var option = options[j];
            option.selected ? selectOption(option) : deselectOption(option);
        };
    }

    selected.init = function(selector) {
        // Work out width of text
        var textWidthTester = document.createElement('div');
        textWidthTester.style.visibility = 'hidden';
        textWidthTester.style.float = 'left';
        textWidthTester.textContent = 'm';
        document.body.appendChild(textWidthTester);
        selected.textWidth = textWidthTester.offsetWidth;
        document.body.removeChild(textWidthTester);

        selector = selector || '.selected';
        var selects = document.querySelectorAll('select' + selector);

        for(var i=0; i<selects.length; i++) {
            this.create(selects[i]);
        };
    };

    if (typeof module != 'undefined')
        module.exports = selected;
    else
        window.selected = selected;
})();
