gulp = require 'gulp'

class TaskManager

  @register:(config,taskContainerArrayConstructor)=>
    console.log config
    taskContainerArray = []
    # Instansing task containers
    taskContainerArrayConstructor.forEach (containerConstructor)=>
      taskContainerArray.push new containerConstructor()
    taskContainerArray.forEach (taskContainer)=>
      # Fetch names of the task
      taskNames = taskContainer.getTaskNames(config)
      if !Array.isArray taskNames
        taskNames = [taskNames]
      taskNames.forEach (taskName)=>
        gulp.task taskName, ()->
          taskContainer.task(taskName,config)

module.exports = TaskManager;
