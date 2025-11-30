// src/hooks/useRealtime.js
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useRealtime({ baseUrl = "http://localhost:8080", driverId, passengerId, onMessage }) {
  const clientRef = useRef(null);

  useEffect(() => {
    const sockUrl = baseUrl.replace(/\/$/, "") + "/ws";
    const sock = new SockJS(sockUrl);
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 2000,
      debug: (msg) => {
        // console.log("STOMP:", msg);
      },
      onConnect: () => {
        // topic subscriptions (driver & passenger)
        if (driverId) {
          client.subscribe(`/topic/driver/${driverId}`, (frame) => {
            try { onMessage && onMessage(JSON.parse(frame.body)); } catch { onMessage && onMessage(frame.body); }
          });
        }
        if (passengerId) {
          client.subscribe(`/topic/passenger/${passengerId}`, (frame) => {
            try { onMessage && onMessage(JSON.parse(frame.body)); } catch { onMessage && onMessage(frame.body); }
          });
        }
        // user queue
        client.subscribe("/user/queue/notifications", (frame) => {
          try { onMessage && onMessage(JSON.parse(frame.body)); } catch { onMessage && onMessage(frame.body); }
        });
      },
    });

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [baseUrl, driverId, passengerId, onMessage]);
}
