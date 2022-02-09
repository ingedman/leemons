const emit = require('../events/emit');
const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');
const versioningCreate = require('./versions/create');

module.exports = async function create(
  {
    name,
    tagline,
    level,
    summary,
    cover,
    color,
    methodology,
    recommendedDuration,
    statement,
    development,
    submissions,
    selfReflection,
    feedback,
    instructionsForTeacher,
    instructionsForStudent,
    state,
  },
  { transacting: t } = {}
) {
  try {
    return global.utils.withTransaction(
      async (transacting) => {
        let task = {
          tagline,
          level,
          summary,
          cover,
          color,
          methodology,
          recommendedDuration,
          statement,
          development,
          submissions,
          selfReflection,
          feedback,
          instructionsForTeacher,
          instructionsForStudent,
          state,
          published: false,
        };

        // EN: Register task versioning
        // ES: Registrar versionado de tarea
        const taskInfo = await versioningCreate(
          {
            name,
          },
          { transacting }
        );

        // EN: Generate an id with the task versioning id and the current version
        // ES: Generar un id con el id de versionamiento de tarea y la versión actual
        // id@version
        const { fullId, id, version } = await parseId(taskInfo.id, taskInfo.last, { transacting });
        task.id = fullId;

        // EN: Create task instance
        // ES: Crear instancia de tarea
        task = await tasks.create(task, { transacting });

        // EN: Emit the event.
        // ES: Emitir el evento.
        emit('task.created', { id: taskInfo.id });

        return { name, fullId, id, version, current: `${id}@current` };
      },
      tasks,
      t
    );
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
};
