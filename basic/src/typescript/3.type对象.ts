type Gender = "man" | "women" | "other";

type Person = {
    id: number;
    name: string;
    age: number;
    email?: string; // 可选属性
    info:{
        gender: Gender
    }
};

type Pig={
    name: string;
    age: number;
    hobby:{
        aihao: string;
    }
}

type Animal = Person & Pig; // 交叉类型

const animal: Animal = {
    id: 1,
    name: "Tom",
    age: 5,
    email: "tom@example.com",
    info: {
        gender: "man"
    },
    hobby: {
        aihao: "playing"
    }
};