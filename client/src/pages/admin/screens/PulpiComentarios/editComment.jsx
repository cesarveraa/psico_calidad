import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCommentById, updateComment, createComment } from '../../../../services/index/pulpiComentarios';

const AddEditComment = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const userState = useSelector(state => state.user);
    const [commentData, setCommentData] = useState({
        comentario: "",
    });

    const { isLoading, isError } = useQuery({
        queryKey: ["pulpiComments", id],
        queryFn: () => getCommentById(id),
        onSuccess: (data) => {
            setCommentData({
                comentario: data.comentario,
            });
        },
        refetchOnWindowFocus: false,
        enabled: !!id, // Solo ejecutar si hay id
    });

    const { mutate: updateMutate, isLoading: isUpdating } = useMutation({
        mutationFn: ({ updatedData, id, token }) => updateComment(id, updatedData.comentario, token),
        onSuccess: () => {
            toast.success("Comentario actualizado exitosamente");
            queryClient.invalidateQueries(["pulpiComments", id]);
            navigate(`/admin/pulpiComments`, { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
            console.error(error);
        },
    });

    const { mutate: createMutate, isLoading: isCreating } = useMutation({
        mutationFn: ({ comentario, token }) => createComment(comentario, token),
        onSuccess: () => {
            toast.success("Comentario creado exitosamente");
            queryClient.invalidateQueries(["pulpiComments"]);
            navigate(`/admin/pulpiComments`, { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
            console.error(error);
        },
    });

    const handleInputChange = (field, value) => {
        setCommentData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveComment = async () => {
        const token = userState.userInfo.token;
        if (id) {
            try {
                updateMutate({ updatedData: commentData, id, token });
            } catch (error) {
                toast.error(error.message);
                console.error(error);
            }
        } else {
            try {
                createMutate({ comentario: commentData.comentario, token });
            } catch (error) {
                toast.error(error.message);
                console.error(error);
            }
        }
    };

    if (isLoading) return <p>Cargando...</p>;
    if (isError) return <p>Error al cargar el comentario</p>;

    return (
        <div className="container mx-auto max-w-7xl p-5">
            <section className="bg-purple-400 text-white text-center py-4 text-4xl font-bold uppercase">
                {id ? "Editar Comentario" : "Agregar Comentario"}
            </section>

            <div className="mt-4">
                <label htmlFor="comentario" className="block mb-2 text-sm font-medium text-black-900 dark:text-black-300">
                    Comentario:
                </label>
                <input
                    id="comentario"
                    type="text"
                    value={commentData.comentario}
                    onChange={(e) => handleInputChange('comentario', e.target.value)}
                    placeholder="Escribe tu comentario"
                    className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 p-2.5 dark:text-white dark:bg-gray-800 dark:border-gray-600"
                />
            </div>

            <button
                onClick={handleSaveComment}
                disabled={isCreating || isUpdating}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {id ? "Actualizar Comentario" : "Agregar Comentario"}
            </button>
        </div>
    );
};

export default AddEditComment;
