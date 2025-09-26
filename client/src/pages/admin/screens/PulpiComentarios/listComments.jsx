import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSystemLog } from '../../../../services/index/logsSistema';
import { createComment, deleteComment, getAllComments } from '../../../../services/index/pulpiComentarios';

const ListComments = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector(state => state.user);
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['pulpiComentarios'],
    queryFn: getAllComments,
    refetchOnWindowFocus: false,
  });

  const { mutate: createCommentMutate, isLoading: isCreating } = useMutation({
    mutationFn: ({ comentario, token }) => createComment(comentario, token),
    onSuccess: async () => {
      toast.success('Comentario creado exitosamente');
      queryClient.invalidateQueries(['pulpiComentarios']);
      setNewComment("");

      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_pulpi",
        accion: "Creó un nuevo comentario",
      }, userState.userInfo.token);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const { mutate: deleteCommentMutate, isLoading: isDeleting } = useMutation({
    mutationFn: ({ id, token }) => deleteComment(id, token),
    onSuccess: async () => {
      toast.success('Comentario eliminado exitosamente');
      queryClient.invalidateQueries(['pulpiComentarios']);

      await createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_pulpi",
        accion: "Eliminó un comentario",
      }, userState.userInfo.token);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const handleEdit = (id) => {
    navigate(`/admin/pulpiComments/edit/${id}`);
  };

  const handleDelete = (id) => {
    const token = userState.userInfo.token;
    deleteCommentMutate({ id, token });
  };

  const handleCreateComment = () => {
    const token = userState.userInfo.token;
    createCommentMutate({ comentario: newComment, token });
  };

  useEffect(() => {
    if (userState.userInfo) {
      createSystemLog({
        userId: userState.userInfo._id,
        email: userState.userInfo.email,
        sistema: "manage_pulpi",
        accion: "Accedió a la gestión de comentarios Pulpi",
      }, userState.userInfo.token).catch(console.error);
    }
  }, []);

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar los comentarios</p>;

  return (
    <div className="container mx-auto max-w-7xl p-5">
      <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
        Lista de Comentarios
      </section>

      <div className="mt-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nuevo Comentario"
          className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 mb-4"
        />
        <button
          onClick={handleCreateComment}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          disabled={isCreating}
        >
          Agregar Comentario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="mt-2 text-lg">{comment.comentario}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(comment._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(comment._id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                disabled={isDeleting}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListComments;
