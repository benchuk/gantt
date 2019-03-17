function GanttAdapter(rootSVG)
{
    this.container = rootSVG;
    this.groupCount = 0;
    this.factory = new GanttItemsFactory();
}

GanttAdapter.prototype.getGroupsCountInRange = function()
{
    return this.groupCount
}

GanttAdapter.prototype.CreateTaskFor = function(groupIndex,itemIndex)
{
    //TBD: must remove 'container' dependency - only the layout manager should have it.
    return  ganttFactory.createTask(options, container);
    //user should call  res.draw(ROOT); to draw
    //user should call //res.draggable(ROOT) to make draggable
}


