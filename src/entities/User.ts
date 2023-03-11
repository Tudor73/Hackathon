import {Entity, Column, PrimaryColumn } from "typeorm";

@Entity() 
export class User {
    @PrimaryColumn()
    id: number;

    @Column()
    githubId: string;

    @Column()
    name: string;

    @Column()
    email: string;
    // avatarUrl: string;
    // createdAt: Date;
    // updatedAt: Date;
}