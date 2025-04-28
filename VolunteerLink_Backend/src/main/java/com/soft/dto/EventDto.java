package com.soft.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventDto {
    private Long id;
    private String title;
    private LocalDateTime date;
    private String description;
    private String location;
    private Long createdById;
    private String createdByName;
    private BigDecimal salary;
    private String organizerPhoneNumber;
	public EventDto(Long id, String title, LocalDateTime date, String description, String location, Long createdById,
			String createdByName, BigDecimal salary, String organizerPhoneNumber) {
		super();
		this.id = id;
		this.title = title;
		this.date = date;
		this.description = description;
		this.location = location;
		this.createdById = createdById;
		this.createdByName = createdByName;
		this.salary = salary;
		this.organizerPhoneNumber = organizerPhoneNumber;
	}
	public EventDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public LocalDateTime getDate() {
		return date;
	}
	public void setDate(LocalDateTime date) {
		this.date = date;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public Long getCreatedById() {
		return createdById;
	}
	public void setCreatedById(Long createdById) {
		this.createdById = createdById;
	}
	public String getCreatedByName() {
		return createdByName;
	}
	public void setCreatedByName(String createdByName) {
		this.createdByName = createdByName;
	}
	public BigDecimal getSalary() {
		return salary;
	}
	public void setSalary(BigDecimal salary) {
		this.salary = salary;
	}
	public String getOrganizerPhoneNumber() {
		return organizerPhoneNumber;
	}
	public void setOrganizerPhoneNumber(String organizerPhoneNumber) {
		this.organizerPhoneNumber = organizerPhoneNumber;
	}
    
     

}