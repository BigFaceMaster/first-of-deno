import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";


const app = new Application();


interface Dog {
    name: string;
    age: number;
}

let dogs: Array<Dog> = [
    {
        name: "Roger",
        age: 8,
    },
    {
        name: 'Syd',
        age: 7,
    },
];


export const getDogs = ({ response }: { response: any } ) => {
    response.body = dogs;
}

export const getDog = ({
    params,
    response
}: {
    params: {
        name: string;
    };
    response: any;
}) => {
    const dog = dogs.filter(dog => dog.name = params.name);
    if(dog.length) {
        response.status = 200;
        response.body = dog[0];
        return;
    }
    response.status = 400;
    response.body = {
        msg: `Cannot find dog ${params.name}`
    }
}

export const addDog = async ({
    request,
    response,
}: {
    request: any;
    response: any;
}) => {
    const body = await request.body();
    const dog: Dog = body.value;
    dogs.push(dog);

    response.body = { msg: 'OK' };
    response.status = 200;
}

export const updateDog = async ({
    params,
    request,
    response,
}: {
    params: {
        name: string;
    };
    request: any;
    response: any;
}) => {
    const temp = dogs.filter(dog => dog.name = params.name);
    const body = await request.body();
    const { age }: { age: number } = body.value;

    if(temp.length) {
        temp[0].age = age;
        response.status = 200;
        response.body = {
            msg: "OK"
        };
        return;
    }

    response.status = 400;
    response.body = {
        msg: `Cannot find dog ${params.name}`
    }
}

export const removeDog = ({
    params,
    response,
}: {
    params: {
        name: string;
    };
    response: any;
}) => {
    const lengthBefore = dogs.length;
    dogs = dogs.filter(dog => dog.name !== params.name);

    if(dogs.length === lengthBefore) {
        response.status = 4000;
        response.body = {
            msg: `Cannot find god ${params.name}`
        }
        return;
    }

    response.body = {
        msg: 'OK'
    }
    response.status = 400;
}

const router = new Router();

router.get("/dogs",  getDogs)
      .get("/dogs/:name", getDog)
    .post("/dogs", addDog)
    .put("/dogs/:name")
    .delete("/dogs/:name", removeDog)

app.use(router.routes())
app.use(router.allowedMethods())

console.log(`Listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);
