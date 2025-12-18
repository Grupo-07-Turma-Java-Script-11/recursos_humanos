import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';


describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
    let token: any;
    let usuarioId: any;
    let app: INestApplication<App>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [__dirname + "./../src/**/entities/*.entity.ts"],
                    synchronize: true,
                    dropSchema: true,
                }),
                AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    })

    it("01 - Deve Cadastrar um novo Usuário", async () => {
        const resposta = await request(app.getHttpServer())
            .post('/unidades/cadastrar')
            .send({
                nome: 'Root',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: '-',
            })
            .expect(201)

        usuarioId = resposta.body.id;

    });

    it("02 - Não Deve Cadastrar um Usuário Duplicado", async () => {
        await request(app.getHttpServer())
            .post('/unidades/cadastrar')
            .send({
                nome: 'Root',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: '-',
            })
            .expect(400)
    });

    it("03 - Deve Autenticar o Usuário (Login)", async () => {
        const resposta = await request(app.getHttpServer())
            .post("/login/logar")
            .send({
                usuario: 'root@root.com',
                senha: 'rootroot',
            })
            .expect(200)

        token = resposta.body.token;
    })

    it("04 - Deve Listar todos os Usuários", async () => {
        return request(app.getHttpServer())
            .get('/unidades')
            .set('Authorization', `${token}`)
            .send({})
            .expect(200)
    })

    it("05 - Deve Atualizar um Usuário", async () => {
        return request(app.getHttpServer())
            .put('/unidades/atualizar')
            .set('Authorization', `${token}`)
            .send({
                id: usuarioId,
                nome: 'Root Atualizado',
                usuario: 'root@root.com',
                senha: 'rootroot',
                foto: '-',
            })
            .expect(200)
            .then(resposta => {
                expect("Root Atualizado").toEqual(resposta.body.nome)
            })

    })
});