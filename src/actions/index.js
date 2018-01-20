export const FETCH_NOTELIST = "FETCH_NOTELIST";
export const FETCH_NOTEBOOKLIST = "FETCH_NOTEBOOKLIST";
export const FETCH_NOTEBOOKDETAIL = "FETCH_NOTEBOOKDETAIL";
export const FETCH_NOTEDETAIL = "FETCH_NOTEDETAIL";
export const POST_NOTE = "POST_NOTE";
export const DELETE_NOTE = "DELETE_NOTE";
export const MOVE_NOTE = "MOVE_NOTE";

// TODO: Detatch it later
let axiosMock = {
  noteBaseData: [
      { id: 3, title: "Third note", contents: "flsj", date: "2018-01-18", notebookId: 1, notebookTitle: 'TODO' },
      { id: 2, title: "Second note", contents: "efgh", date: "2018-01-17", notebookId: 2, notebookTitle: 'DONE' },
      { id: 1, title: "First note", contents: "abcd", date: "2018-01-16", notebookId: 1, notebookTitle: 'TODO' }
  ],

  notebookBaseData: [
    { id: 1, title: "TODO", desc: "Keep this notes", noteIdList: [1, 3], color: "#F8BA00" },
    { id: 2, title: "DONE", desc: "I've done it", noteIdList: [2], color: "#F86422" }
  ],
  
  /* Returns Promise object that contains data */
  _promiseMaker: function(data) {
    return new Promise((resolve, reject) => {
      resolve({ data });
    });
  },

  _sortByTitle: function(arr) {
    return arr.sort((a, b) => {
      const titleA = a.title.toUpperCase(), titleB = b.title.toUpperCase();
      if(titleA < titleB) {
      return -1;
      } else if(titleA > titleB) {
        return 1;
      }
      return 0;
    });
  },
  
  _sortByDate: function(arr) {
    return arr.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  },

  _clone: function(obj) {
    if (obj === null || typeof(obj) !== 'object') {
      return obj;
    }
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = this._clone(obj[attr]);
      }
    }
    return copy;
  },

  /* Mockup of GET method */
  get: function(url, option) {
    /* Returns note list */
    if(url === '/api/note/') {
      return this._promiseMaker(this.noteBaseData);
    } else if(url === '/api/notebook/') {
      return this._promiseMaker(this.notebookBaseData);
    } else if(/\/api\/notebook\/\d\//.exec(url)) {
      let id = url.split('/')[3];
      let filteredNotebookBaseData = this.notebookBaseData.find(notebookData => {
        if(notebookData.id === Number(id)) {
          notebookData.noteList = this.noteBaseData.filter(noteData => {
            return notebookData.noteIdList.includes(noteData.id);
          });
          return true;
        } else { return false }
      });

      if(option && option.params) {
        if(option.params.sort === 'title') {
          filteredNotebookBaseData.noteList = this._sortByTitle(filteredNotebookBaseData.noteList);
        } else if(option.params.sort === 'date') {
          filteredNotebookBaseData.noteList = this._sortByDate(filteredNotebookBaseData.noteList);
        }
      }
      /* Clone object because react doesn't render just modified (same) object. */
      return this._promiseMaker(this._clone(filteredNotebookBaseData));
    } else if(/\/api\/note\/\d\//.exec(url)) {
      let id = url.split('/')[3];
      return this._promiseMaker(this.noteBaseData.filter(d => d.id === Number(id)).pop())
    }
  },

  post: function(url, option) {
    if(/\/api\/note\/\d\//.exec(url)) {
      let id = url.split('/')[3];
      return this._promiseMaker(`Note no.${id} successfully saved`);
    }
  },

  delete: function(url) {
    let id = url.split('/')[3];
    return this._promiseMaker(`Note no.${id} successfully deleted`);
  },

  put: function(url) {
    return this._promiseMaker(`Note was successfully moved`);
  }
}

export function fetchNoteList(option) {
  const request = axiosMock.get('/api/note/', option);
  return {
    type: FETCH_NOTELIST,
    payload: request
  };
}

export function fetchNotebookList() {
  const request = axiosMock.get('/api/notebook/');
  return {
    type: FETCH_NOTEBOOKLIST,
    payload: request
  };
}

export function fetchNotebookDetail(id, option) {
  const request = axiosMock.get(`/api/notebook/${id}/`, option);
  return {
    type: FETCH_NOTEBOOKDETAIL,
    payload: request
  };
}

export function fetchNoteDetail(id) {
  const request = axiosMock.get(`/api/note/${id}/`);
  return {
    type: FETCH_NOTEDETAIL,
    payload: request
  };
}

export function postNote(id, formData) {
  /* Backend Logic: If note id exists in database, then update note. If not, then create new note. */
  const csrftoken = 'abc123';
  const request = axiosMock.post(`/api/note/${id}/`, {
    data: formData,
    headers: {
      'X-CSRFToken': csrftoken
    }
  });
  return {
    type: POST_NOTE,
    payload: request
  };
}

export function deleteNote(id) {
  const csrftoken = 'abc123';
  const request = axiosMock.delete(`/api/note/${id}/`, {
    headers: {
      'X-CSRFToken': csrftoken
    }
  });
  return {
    type: DELETE_NOTE,
    payload: request
  };
}

export function moveNote(id) {
  const csrftoken = 'abc123';
  const request = axiosMock.put(`/api/note/${id}/`, {
    headers: {
      'X-CSRFToken': csrftoken
    }
  });
  return {
    type: MOVE_NOTE,
    payload: request
  };
}
