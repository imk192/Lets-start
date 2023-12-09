import { request } from "./parse.js"

const  inpElement = document.getElementById('title')
const  createBtn = document.getElementById('create')
const  listElement = document.getElementById('list')

const notes = await request('/api/notes').then(resolve => resolve)

function render(){
    listElement.innerHTML = ''
    if (notes.length === 0) {
        listElement.innerHTML = '<p class="form">Здесь пока ничего нет!<p/>'
        }
    for(let i = 0; i < notes.length; i++){
        listElement.insertAdjacentHTML('beforeend', getNoteTemplate(notes[i], i))
    }
}

render()

createBtn.onclick = async function () {
    if(inpElement.value.length === 0){
        return
    }
    const newNote = {
        title: inpElement.value,
        completed: false,
    }

    const newElem = await request('/api/notes', 'POST', newNote).then(resolve => resolve)
    console.log(newElem)
    notes.push(newElem)
    render()
    inpElement.value = ''
}

listElement.onclick = async function (event) {
    if (event.target.dataset.index) {
        const index = Number(event.target.dataset.index)
        const type = event.target.dataset.type


        if (type === 'toggle') {
            await request(`/api/notes/${notes[index].id}`, 'PUT', {
                ...notes[index],
                completed: notes[index].completed = !notes[index].completed
            })
            // notes[index].completed = !notes[index].completed
        } else if (type === 'remove') {
            console.log(notes[index].id)
            await request(`/api/notes/${notes[index].id}`, 'DELETE')
            notes.splice(index, 1)
        }
    }
    render()
}

function getNoteTemplate(note, index) {
    return `
    <li class="listElement">
        <div id="textIn" class="${note.completed ? 'text-decoration-line-through' : ''}">
          ${note.title}
        </div>
        <div id="btns">
          <span class="btn${note.completed ? 'Warning' : 'Success'}" data-index="${index}" data-type="toggle">&check;</span>
          <span class="btnDanger" data-index="${index}" data-type="remove">&times;</span>
        </div>
      </li>
    
    `
}