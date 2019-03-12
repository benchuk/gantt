this.adapter

function setAdapter(adapter) {

}


function refresh() {
    this.adapter.setDateRange(startDate, endDate)
    var groupCount = this.adapter.getGroupsCountInRange()
    for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {

        var itemsCountInGroup = this.adapter.getCountItemsInDateRangeForGroupAt(groupIndex);
        for (var i = 0; i < itemsCountInGroup; i++) {
            var task = this.adapter.CreateTaskFor(groupIndex, itemIndex);
            //TBD: Calc x,y
            task.setPosition(x, y)
        }
    }
}

//day, 3days, workdays, week, month, 3 month, year.
function setViewType(type) {

}

function setStartDate(startDate) {

}

function onDrag(evt) {

}