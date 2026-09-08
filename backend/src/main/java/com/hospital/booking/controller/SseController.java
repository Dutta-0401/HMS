package com.hospital.booking.controller;

import com.hospital.booking.service.SseEmitterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@RestController
@RequestMapping("/api/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseEmitterService sseEmitterService;

    @GetMapping(value = "/bookings/{hospitalId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribeToBookings(@PathVariable String hospitalId) {
        log.info("Hospital {} subscribed to booking stream", hospitalId);
        SseEmitter emitter = sseEmitterService.createEmitter(hospitalId);
        
        try {
            // Send heartbeat to confirm connection
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("Connected to booking stream")
                    .id("connect-" + System.currentTimeMillis()));
        } catch (Exception e) {
            log.error("Error sending connection confirmation", e);
        }
        
        return emitter;
    }
}
