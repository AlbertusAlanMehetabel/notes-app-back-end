// http://notesapp-v1.dicodingacademy.com/notes/new

const Hapi = require('@hapi/hapi');

const notes = [];

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);

  server.route([
    {
      method: 'POST',
      path: '/notes',
      handler: (request, h) => {
        const { title, tags, body } = request.payload;
        const id = Math.floor(Math.random() * 1000000).toString();
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const newNote = {
          id,
          title,
          tags,
          body,
          createdAt,
          updatedAt,
        };
        notes.push(newNote);
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil ditambahkan',
          data: {
            noteId: id,
          },
        });
        response.code(201);
        return response;
      },
    },
    {
      method: 'GET',
      path: '/notes',
      handler: (request, h) => ({
        status: 'success',
        data: {
          notes,
        },
      }),
    },
    {
      method: 'GET',
      path: '/notes/{id}',
      handler: (request, h) => {
        const { id } = request.params;
        const note = notes.filter((n) => n.id === id)[0];
        if (note) {
          return {
            status: 'success',
            data: {
              note,
            },
          };
        }
        const response = h.response({
          status: 'fail',
          message: 'Catatan tidak ditemukan',
        });
        response.code(404);
        return response;
      },
    },
    {
      method: 'PUT',
      path: '/notes/{id}',
      handler: (request, h) => {
        const { id } = request.params;
        const { title, tags, body } = request.payload;
        const index = notes.findIndex((note) => note.id === id);
        if (index !== -1) {
          notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt: new Date().toISOString(),
          };
          return {
            status: 'success',
            message: 'Catatan berhasil diperbarui',
          };
        }
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui catatan. Id tidak ditemukan',
        });
        response.code(404);
        return response;
      },
    },
    {
      method: 'DELETE',
      path: '/notes/{id}',
      handler: (request, h) => {
        const { id } = request.params;
        const index = notes.findIndex((note) => note.id === id);
        if (index !== -1) {
          notes.splice(index, 1);
          return {
            status: 'success',
            message: 'Catatan berhasil dihapus',
          };
        }
        const response = h.response({
          status: 'fail',
          message: 'Gagal menghapus catatan. Id tidak ditemukan',
        });
        response.code(404);
        return response;
      },
    },
  ]);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
