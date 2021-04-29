package com.codenart.agendaapi.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codenart.agendaapi.model.entity.Contato;

public interface ContatoRepository extends JpaRepository<Contato, Integer> {
}
