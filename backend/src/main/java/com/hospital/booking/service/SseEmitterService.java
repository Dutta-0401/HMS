package com.hospital.booking.service;

import com.hospital.booking.entity.Booking;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Service
public class SseEmitterService {

    // hospitalId → list of open dashboard connections
    private final Map<String, List<SseEmitter>> clients = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(String hospitalId) {
        log.debug("Creating SSE emitter for hospital: {}", hospitalId);
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        clients.computeIfAbsent(hospitalId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> {
            log.debug("SSE emitter completed for hospital: {}", hospitalId);
            remove(hospitalId, emitter);
        });
        emitter.onTimeout(() -> {
            log.debug("SSE emitter timeout for hospital: {}", hospitalId);
            remove(hospitalId, emitter);
        });
        emitter.onError(e -> {
            log.debug("SSE emitter error for hospital: {}: {}", hospitalId, e.getMessage());
            remove(hospitalId, emitter);
        });

        return emitter;
    }

    public void broadcastBooking(Booking booking) {
        log.info("Broadcasting new booking to hospital: {}", booking.getHospitalId());
        List<SseEmitter> targets = new ArrayList<>(clients.getOrDefault(booking.getHospitalId(), List.of()));
        List<SseEmitter> dead = new ArrayList<>();

        for (SseEmitter e : targets) {
            try {
                e.send(SseEmitter.event()
                        .name("new-booking")
                        .data(booking)
                        .id(booking.getId()));
                log.debug("Booking broadcast successful to one client");
            } catch (IOException ex) {
                log.warn("Failed to send booking to client, marking for removal", ex);
                dead.add(e);
            }
        }
        targets.removeAll(dead);
    }

    public void broadcastBookingUpdate(Booking booking) {
        log.info("Broadcasting booking update to hospital: {}", booking.getHospitalId());
        List<SseEmitter> targets = new ArrayList<>(clients.getOrDefault(booking.getHospitalId(), List.of()));
        List<SseEmitter> dead = new ArrayList<>();

        for (SseEmitter e : targets) {
            try {
                e.send(SseEmitter.event()
                        .name("booking-updated")
                        .data(booking)
                        .id(booking.getId()));
                log.debug("Booking update broadcast successful to one client");
            } catch (IOException ex) {
                log.warn("Failed to send booking update to client, marking for removal", ex);
                dead.add(e);
            }
        }
        targets.removeAll(dead);
    }

    private void remove(String hospitalId, SseEmitter emitter) {
        List<SseEmitter> list = clients.get(hospitalId);
        if (list != null) {
            list.remove(emitter);
            log.debug("Removed SSE emitter, remaining clients for hospital {}: {}", hospitalId, list.size());
            if (list.isEmpty()) {
                clients.remove(hospitalId);
            }
        }
    }
}