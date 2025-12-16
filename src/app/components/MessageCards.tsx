import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from 'react';
import supabaseClient from '../../lib/supabaseClient';
import { Heart, Image as ImageIcon } from 'lucide-react';

export function MessageCards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Normalize photo field
  const normalizePhoto = (photo: string | null | undefined): string | null => {
    if (!photo) return null;
    
    if (typeof photo === 'string' && photo.startsWith('http')) {
      return photo;
    }
    
    if (typeof photo === 'string' && supabaseClient) {
      try {
        const { data } = supabaseClient.storage
          .from('messages')
          .getPublicUrl(photo);
        
        if (data && data.publicUrl) {
          return data.publicUrl;
        }
      } catch (err) {
        console.warn('Failed to get public URL for photo:', err);
      }
    }
    
    return photo || null;
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);

      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error:', error);
          setMessages([]);
          return;
        }

        if (data && data.length > 0) {
          const normalizedMessages = data.map((message: any) => ({
            ...message,
            photo: normalizePhoto(message.photo)
          }));
          setMessages(normalizedMessages);
          return;
        }
      }

      // Try API endpoint if Supabase fails
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const normalizedMessages = data.map((message: any) => ({
              ...message,
              photo: normalizePhoto(message.photo)
            }));
            setMessages(normalizedMessages);
            return;
          }
        }
      } catch (apiError) {
        console.log('API fetch failed');
      }

      // No data found
      setMessages([]);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const handleMessageUpdate = (event: CustomEvent) => {
      if (event.detail) {
        const newMessage = event.detail;
        newMessage.photo = normalizePhoto(newMessage.photo);
        
        setMessages(prev => {
          const exists = prev.some(msg => 
            msg.id === newMessage.id || 
            (msg.name === newMessage.name && msg.message === newMessage.message)
          );
          
          if (!exists) {
            return [newMessage, ...prev];
          }
          return prev;
        });
        
        // Refresh after 1 second
        setTimeout(() => {
          fetchMessages();
        }, 1000);
      }
    };

    const eventHandler = (e: Event) => {
      handleMessageUpdate(e as CustomEvent);
    };
    
    window.addEventListener('messages:updated', eventHandler);

    // Realtime subscription
    let channel: any = null;
    if (supabaseClient) {
      try {
        channel = supabaseClient
          .channel('public:messages')
          .on(
            'postgres_changes',
            { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'messages' 
            },
            (payload) => {
              console.log('Realtime INSERT received:', payload);
              const newMessage = payload.new;
              newMessage.photo = normalizePhoto(newMessage.photo);
              
              setMessages(prev => {
                const exists = prev.some(msg => msg.id === newMessage.id);
                if (!exists) {
                  return [newMessage, ...prev];
                }
                return prev;
              });
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription failed:', err);
      }
    }

    return () => {
      window.removeEventListener('messages:updated', eventHandler);
      if (channel && supabaseClient) {
        supabaseClient.removeChannel(channel);
      }
    };
  }, []);

  return (
    <section id="messages" ref={ref} className="py-24 px-4 bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">💙</div>
      <div className="absolute top-40 right-20 text-6xl opacity-10 animate-pulse delay-1000">💍</div>
      <div className="absolute bottom-20 left-20 text-6xl opacity-10 animate-pulse delay-2000">💐</div>
      <div className="absolute bottom-40 right-10 text-6xl opacity-10 animate-pulse delay-500">✨</div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="w-12 h-12 text-blue-500 fill-current mx-auto" />
          </motion.div>
          
          <h2 className="text-blue-700 mb-3">
            Messages of Love
          </h2>
          
          <p className="text-blue-600 text-lg">
            Heartfelt wishes from friends and family
          </p>
        </motion.div>

        {/* Loading indicator */}
        {loading && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-sm text-blue-500 italic bg-blue-50 inline-block px-6 py-2 rounded-full">
                ⏳ Loading messages from database...
              </p>
            </div>
          </motion.div>
        )}

        {/* Live update indicator */}
        {!loading && messages.length > 0 && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-sm text-blue-500 italic bg-blue-50 inline-block px-6 py-2 rounded-full">
              💌 {messages.length} message{messages.length !== 1 ? 's' : ''} loaded • Updates in real-time
            </p>
          </motion.div>
        )}

        {/* Message Cards Grid */}
        {!loading && messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {messages.map((msg, index) => {
              const messageId = typeof msg.id === 'number' ? msg.id.toString() : msg.id;
              
              return (
                <motion.div
                  key={msg.id}
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-4 border-blue-100 flex flex-col"
                  style={{
                    width: '100%',
                    maxWidth: '380px',
                    minHeight: '520px',
                  }}
                  initial={{ opacity: 0, y: 40, rotate: -5 }}
                  animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8, rotate: 0 }}
                >
                  {/* Name at Top */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-5 text-center">
                    <motion.h3
                      className="text-white text-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      {msg.name}
                    </motion.h3>
                    <div className="flex justify-center gap-1 mt-2">
                      <span className="text-white text-sm">💙</span>
                      <span className="text-white text-sm">✨</span>
                      <span className="text-white text-sm">💙</span>
                    </div>
                  </div>

                  {/* Large Photo Container - FIXED */}
                  <div className="relative flex-grow-0 flex-shrink-0">
                    <div
                      className="relative bg-gradient-to-br from-blue-50 to-blue-100"
                      style={{ height: '240px' }}
                    >
                      {msg.photo ? (
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                          <motion.img
                            src={msg.photo}
                            alt={`Photo from ${msg.name}`}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                              // Hide broken image and show fallback
                              e.currentTarget.style.display = 'none';
                              const container = e.currentTarget.parentElement;
                              if (container) {
                                container.innerHTML = `
                                  <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                                    <div class="mb-3">
                                      <svg class="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                    </div>
                                    <p class="text-blue-400 text-sm text-center">Image not available</p>
                                  </div>
                                `;
                              }
                            }}
                            loading="lazy"
                          />
                          {/* Gradient overlay to ensure text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 via-transparent to-transparent pointer-events-none" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                          <ImageIcon className="w-16 h-16 text-blue-200 mb-3" />
                          <p className="text-blue-400 text-sm text-center">No photo shared</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Heart icon on photo */}
                    <motion.div
                      className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-lg"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Heart className="w-6 h-6 text-blue-600 fill-current" />
                    </motion.div>
                  </div>

                  {/* Message Below */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="text-blue-800 leading-relaxed text-center px-2 flex-grow">
                      {msg.message && msg.message.length > 300 ? (
                        <>
                          <div className={`${expanded === messageId ? 'max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300' : 'h-24 overflow-hidden'}`}>
                            {expanded === messageId ? msg.message : `${msg.message.slice(0, 300)}...`}
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpanded(expanded === messageId ? null : messageId)}
                            className="mt-3 text-sm text-blue-600 underline hover:text-blue-800 transition-colors"
                          >
                            {expanded === messageId ? 'Show less' : 'Read more'}
                          </button>
                        </>
                      ) : (
                        <div className="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300">
                          {msg.message}
                        </div>
                      )}
                    </div>
                    
                    {/* Show timestamp if available */}
                    {msg.created_at && (
                      <div className="text-xs text-blue-500 mt-3 text-center pt-3 border-t border-blue-100">
                        {new Date(msg.created_at).toLocaleString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                    
                    {/* Decorative bottom element */}
                    <motion.div
                      className="flex justify-center gap-2 mt-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      <span className="text-2xl">💙</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : !loading ? (
          // Empty state when no messages
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <Heart className="w-20 h-20 text-blue-200 mx-auto mb-6" />
              <p className="text-blue-600 text-xl mb-4">
                No messages yet
              </p>
              <p className="text-blue-500 mb-8">
                Be the first to send your heartfelt wishes to Lamia!
              </p>
              <a 
                href="#message-form" 
                className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg transition-shadow"
              >
                Send First Message 💌
              </a>
            </div>
          </motion.div>
        ) : null}

        {/* Celebration message */}
        {messages.length > 0 && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <p className="text-blue-600 text-lg italic">
              Every message is a blessing for the beautiful bride 💙✨
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}