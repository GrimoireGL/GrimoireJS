gulp = require 'gulp'

class TaskManager

  @register:(config,taskContainerArrayConstructor)=>
    taskContainerArray = []
    # Instansing task containers
    taskContainerArrayConstructor.forEach (containerConstructor)=>
      taskContainerArray.push new containerConstructor()
    taskContainerArray.forEach (taskContainer)=>
      # Fetch names of the task
      taskNames = taskContainer.getTaskNames config
      if !Array.isArray taskNames
        taskNames = [taskNames]
      taskNames.forEach (taskName)=>
        dependent = []
        if taskContainer.dependentTask
          dependentTasks = taskContainer.dependentTask(taskName,config)
          if dependentTasks
            dependentTasks.forEach (e)=>
              dependent.push e
        gulp.task taskName,dependent, (done)->
          taskContainer.task taskName,config,done

module.exports = TaskManager;
