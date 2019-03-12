this.adapter

function setAdapter(adapter) {

}


function refresh() {
    this.adapter.setDateRange(startDate, endDate)
    var groupCount = this.adapter.getGroupsCountInRange()
    for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {

        var itemsCountInGroup = this.adapter.getCountItemsInDateRangeForGroupAt(groupIndex);
        for (var i = 0; i < itemsCountInGroup; i++) {
            //task can be any graphics it wants
            //task interface should be 
            //setPosition(x,y)
            //getHeight
            //width will be rendered depending on the number of days the task takes and the view mode
            //if task in group are taking place in the same time they will be rendered beneath each other
            //else they will be rendered one after the other
            var task = this.adapter.CreateTaskFor(groupIndex, itemIndex);
            //TBD: Calc x,y
            task.setPosition(x, y)
            task.setWidth() //task should hide text for example of too small
            //h to calc next y
            var h = task.getHeight();
        }
    }
}

function onTaskAtIndexOfGroupDataChanged(groupIndex, itemIndex, startDate, endDate, height) {

}

//'day', '3Days', 'workDays', 'fullWeek', 'month', '3Month', 'year'.
function setViewMode(mode) {

}

function setStartDate(startDate) {

}

function onDrag(evt) {

}