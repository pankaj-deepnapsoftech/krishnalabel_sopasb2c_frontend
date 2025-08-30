// src/context/SocketProvider.tsx
import React, { useEffect } from 'react';
import { socket } from '../socket';
import { useDispatch } from 'react-redux';
import { setConnected, addMessage } from '../redux/reducers/socketSlice';

interface Props {
  children: React.ReactNode;
}

const SocketProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
        console.log('hdgevd')
      dispatch(setConnected(true));
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
    });

    socket.on('message', (msg: string) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default SocketProvider; 
