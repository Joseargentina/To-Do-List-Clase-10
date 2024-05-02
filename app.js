// agregar una funcion que muestre la cantidad de tareas completadas e incompletas
// y una funcionalidad para eliminar tarea

import chalk from 'chalk'
import { existsSync, readFileSync, writeFile } from 'fs'
import { createInterface } from 'readline'

const tasks = []
const filePath = './tasks.json'

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
  console.log(chalk.blue('5. Marcar una tarea como incompleta'))
  console.log(chalk.blue('6. Editar una tarea'))
  console.log(chalk.blue('7. Eliminar tarea'))
  console.log(chalk.blue('8. Salir'), '\n')
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
    ordenarAlfabeticamente()
    saveTask()
    displayMenu()
  })
}

// listsTasks(): para listar todas las tareas.
function listTask () {
  loadTasksFromFile()
  ordenarAlfabeticamente()
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

// Funcion para mostrar las tareas completas e incompletas
function showTask () {
  loadTasksFromFile()
  ordenarAlfabeticamente()
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
        ordenarAlfabeticamente()
        saveTask()
      }
      displayMenu()
    } else {
      console.log(chalk.bgRedBright.bold('No se encontro una tarea con el numero dado intenta nuevamente'))
      completeTask()
    }
  })
}

// Funcion para eliminar una tarea
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
      ordenarAlfabeticamente()
      saveTask()
    } else {
      console.log(chalk.bgRedBright('No se encontro una tarea con el numero dado, intentelo nuevamente'))
      deleteTask()
    }
    displayMenu()
  })
}

// Funcion para leer tareas desde un archivo JSON
function loadTasksFromFile () {
  tasks.length = 0
  if (existsSync(filePath)) {
    try {
      const tasksJson = readFileSync(filePath, 'utf-8')
      if (tasksJson === '') {
        console.log('El archivo esta vacio')
      } else {
        const parseData = JSON.parse(tasksJson)
        tasks.push(...parseData)
        ordenarAlfabeticamente()
      }
    } catch (error) {
      console.log(`Ocurrio un error al leer el archivo ${error}`)
    }
  } else {
    const tasksJson = JSON.stringify(tasks, null, 2)
    writeFile(filePath, tasksJson, (err) => {
      if (err) {
        console.log('Ocurrio un error al escribir el archivo')
      } else {
        console.log('Archivo creado con exito')
        loadTasksFromFile()
      }
    })
  }
}

// Funcion para guardar tareas en un archivo .JSON
function saveTask () {
  if (tasks.length === 0) {
    console.log('No hay tareas para guardar')
  } else {
    const tasksJson = JSON.stringify(tasks, null, 2)
    writeFile(filePath, tasksJson, (err) => {
      if (err) {
        console.log('Error al guardar las tareas')
      } else {
        ordenarAlfabeticamente()
        console.log('Tareas guardadas con exito')
      }
    })
  }
}

// funcion para editar una tarea
function editTask () {
  rl.question('Ingresa el numero de la tarea que deas editar \n', (taskNumber) => {
    if (isNaN(taskNumber)) {
      console.log('Ingresa un numero de tarea valido')
      editTask()
    }

    const taskIndex = tasks.findIndex(task => task.id === Number(taskNumber))

    if (taskIndex !== -1) {
      rl.question(chalk.bgCyanBright('Ingresa la nueva descrpcion de la tarea: \n'), (newDescription) => {
        tasks[taskIndex].task = newDescription
        console.log(`Tarea ${taskNumber} actualizada a: ${newDescription}`)
        saveTask()
        ordenarAlfabeticamente()
        displayMenu()
      })
    } else {
      console.log(chalk.bgRedBright.bold('No se encontró una tarea con el número dado, intenta nuevamente'))
      editTask()
    }
  })
}

// funcion para marcar como incompleta una tarea
function incompleteTask () {
  rl.question('Ingresa el numero de la tarea que deseas evaluar \n', (taskNumber) => {
    if (isNaN(taskNumber)) {
      console.log(chalk.bgRedBright('Entrada no valida. Por favor ingresa un numero'))
      incompleteTask()
    }

    const taskIndex = tasks.findIndex(task => task.id === Number(taskNumber))

    if (taskIndex !== -1) {
      if (tasks[taskIndex].completed) {
        tasks[taskIndex].completed = false
        console.log(chalk.bgBlueBright(`Tarea ${tasks[taskIndex].task} marcada como incompleta ❌`))
        saveTask()
        ordenarAlfabeticamente()
      } else {
        console.log(chalk.bgBlueBright(`La tarea ${tasks[taskIndex].task} ya esta incompletada ❌`))
      }
      displayMenu()
    } else {
      console.log(chalk.bgRedBright.bold('No se encontro una tarea con el numero dado intenta nuevamente'))
      incompleteTask()
    }
  })
}

// Ordenar las tareas alfabeticamente
function ordenarAlfabeticamente () {
  if (tasks.length === 0) {
    console.log('No hay tarteas para ordenar')
  } else {
    tasks.sort((a, b) => a.task.localeCompare(b.task))
  }
}
// chooseOption(): para manejar la selección de opciones por parte del usuario.
function chooseOption () {
  rl.question(chalk.cyanBright('Elige una opcion \n'), (option) => {
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
        console.log(chalk.bgRedBright('Marcar una tarea como incompleta'))
        incompleteTask()
        break
      case '6':
        console.log(chalk.yellow('Editar una tarea'))
        editTask()
        break
      case '7':
        console.log(chalk.red('eliminar tarea'))
        deleteTask()
        break
      case '8':
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

// Aqui agregamos la lectura del archivo JSON
loadTasksFromFile()

// aqui iniciamos el programa
displayMenu()
