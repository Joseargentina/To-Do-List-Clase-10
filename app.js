// agregar una funcion que muestre la cantidad de tareas completadas e incompletas
// y una funcionalidad para eliminar tarea

import chalk from 'chalk'
import { createInterface } from 'readline'

const tasks = []

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log(chalk.white.bgYellowBright('To do List'), '\n')
// Mostrar el menu de opciones
function displayMenu () {
  console.log(chalk.bgGray('Menu de tareas '))
  console.log(chalk.blue('1. Agregar una tarea:'))
  console.log(chalk.blue('2. Listar tareas'))
  console.log(chalk.blue('3. Completar una tarea'))
  console.log(chalk.blue('4. Mostrar estado de las tareas'))
  console.log(chalk.blue('5. Eliminar tarea'))
  console.log(chalk.blue('6. Salir'), '\n')
  chooseOption()
}

// addTask(): para agregar una nueva tarea.
function addTask () {
  rl.question(chalk.yellowBright('Escribe la tarea '), (taskName) => {
    const existTask = tasks.some(task => task.task === taskName)

    if (existTask) {
      console.log(chalk.red(`La tarea con el nombre ${taskName} ya existe`))
    } else {
      tasks.push({
        id: tasks.length + 1,
        task: taskName,
        completed: false
      })
      console.log(chalk.green(`Tarea con el nombre ${taskName} agregada con exito `))
    }

    displayMenu()
  })
}

// listsTasks(): para listar todas las tareas.
function listTask () {
  if (tasks.length === 0) {
    console.log(chalk.bgBlueBright('La lista de tareas esta vacio' + '\n'))
    displayMenu()
    return
  } else {
    tasks.forEach((task, index) => {
      const status = task.completed ? '✅' : '❌'
      if (task.completed) {
        console.log(chalk.whiteBright(`${index + 1}. ${task.task} `) + chalk.greenBright(` completa ${status} `))
      } else {
        console.log(chalk.whiteBright(`${index + 1}. ${task.task} `) + chalk.redBright(` incompleta ${status}`))
      }
    })
  }

  displayMenu()
}

// completeTask(): para marcar una tarea como completada.
function completeTask () {
  rl.question(chalk.bgMagentaBright('Digita el numero de la tarea que deseas completar: \n'), (taskNumber) => {
    if (isNaN(taskNumber)) {
      console.log(chalk.bgRedBright('Entrada no valida. Por favor ingresa un numero'))
      completeTask()
      return
    }

    const taskIndex = tasks.findIndex(task => task.id === Number(taskNumber))

    if (taskIndex !== -1) {
      if (tasks[taskIndex].completed) {
        console.log(`La tarea ${tasks[taskIndex].task} ya está completada ✅`)
      } else {
        tasks[taskIndex].completed = true
        console.log(`Tarea ${tasks[taskIndex].task} completada ✅`)
      }
      displayMenu()
    } else {
      console.log(chalk.bgRedBright.bold('No se encontro una tarea con el numero dado intenta nuevamente'))
      completeTask()
    }
  })
}
function deleteTask () {
  rl.question(chalk.bgGreenBright('Ingresa el numero de la tarea que deseas eliminar: \n'), (taskNumber) => {
    if (isNaN(taskNumber)) {
      console.log(chalk.bgRedBright('Entrada no valida. Por favor ingresa un numero'))
      deleteTask()
      return
    }

    const taskIndex = tasks.findIndex(task => task.id === Number(taskNumber))

    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1)
      console.log(chalk.bgRedBright(`Tarea ${taskNumber} eliminada con exito`))
    } else {
      console.log(chalk.bgRedBright('No se encontro una tarea con el numero dado, intentelo nuevamente'))
      deleteTask()
    }
    displayMenu()
  })
}

function showTask () {
  if (tasks.length === 0) {
    console.log(chalk.bgBlueBright('La lista de tareas esta vacio' + '\n'))
    displayMenu()
  } else {
    const completeTask = tasks.filter(task => task.completed === true)
    const incompleteTask = tasks.filter(task => task.completed !==
    true)

    console.log(chalk.bgGreen('Tareas Completadas'))
    completeTask.forEach(task => {
      console.log(chalk.green(`ID: ${task.id}, Tarea: ${task.task} ✅ `))
    })
    console.log(chalk.bgRedBright('Tareas Incompletas'))
    incompleteTask.forEach(task => {
      console.log(chalk.red(`ID: ${task.id}, Tarea: ${task.task} ❌`))
    })
    displayMenu()
  }
}

// chooseOption(): para manejar la selección de opciones por parte del usuario.
function chooseOption () {
  rl.question(chalk.cyanBright('Elige una opcion '), (option) => {
    switch (option) {
      case '1':
        console.log(chalk.green('agregar una tarea'))
        addTask()
        break
      case '2':
        console.log(chalk.yellowBright('listado de tareas'))
        listTask()
        break
      case '3':
        console.log(chalk.blue('completar una tarea'))

        completeTask()
        break
      case '4':
        console.log(chalk.yellow('Mostrar tareas completas e incompletas'))
        showTask()
        break
      case '5':
        console.log(chalk.red('eliminar tarea'))
        deleteTask()
        break
      case '6':
        console.log('Adios 🖐️')
        rl.close()
        break
      default:
        console.log(chalk.bgRedBright.bold('Opcion invalida intenta nuevamente'))
        displayMenu()
        chooseOption()
        break
    }
  })
}

displayMenu()
