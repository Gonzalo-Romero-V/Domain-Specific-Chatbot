/**
 * Servicio de API para consumir el backend FastAPI
 */

const API_BASE_URL = "http://127.0.0.1:8000";

// =============================
// TIPOS
// =============================

export interface RAGRequest {
  query: string;
  user_id?: string;
  conversation_id?: string;
}

export interface ChunkResponse {
  document: string;
  distance: number;
  metadata?: Record<string, any>;
}

export interface RAGResponse {
  response: string;
  query: string;
  chunks?: ChunkResponse[];
}

export interface UserCreate {
  username: string;
  email: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface ConversationCreate {
  user_id: string;
  title?: string;
}

export interface ConversationResponse {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface MessageResponse {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

// =============================
// FUNCIONES DE API
// =============================

/**
 * Maneja errores HTTP y lanza excepciones con mensajes amigables
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

/**
 * Envía una consulta RAG al backend
 */
export async function sendRAGQuery(
  query: string,
  conversationId?: string
): Promise<RAGResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        conversation_id: conversationId,
      } as RAGRequest),
    });

    return handleResponse<RAGResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Crea un nuevo usuario
 */
export async function createUser(
  username: string,
  email: string
): Promise<UserResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
      } as UserCreate),
    });

    return handleResponse<UserResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Obtiene un usuario por ID
 */
export async function getUser(userId: string): Promise<UserResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<UserResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Obtiene un usuario por email
 */
export async function getUserByEmail(email: string): Promise<UserResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/by-email/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<UserResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Crea una nueva conversación
 */
export async function createConversation(
  userId: string,
  title?: string
): Promise<ConversationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        title,
      } as ConversationCreate),
    });

    return handleResponse<ConversationResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Obtiene una conversación por ID
 */
export async function getConversation(
  conversationId: string
): Promise<ConversationResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/conversation/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse<ConversationResponse>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Obtiene todas las conversaciones de un usuario
 */
export async function getUserConversations(
  userId: string
): Promise<ConversationResponse[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/user/${userId}/conversations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse<ConversationResponse[]>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Elimina una conversación y todos sus mensajes asociados
 */
export async function deleteConversation(
  conversationId: string
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/conversation/${conversationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await handleResponse<{ message: string }>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

/**
 * Obtiene todos los mensajes de una conversación
 */
export async function getConversationMessages(
  conversationId: string
): Promise<MessageResponse[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/conversation/${conversationId}/messages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return handleResponse<MessageResponse[]>(response);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de red al conectar con el servidor");
  }
}

