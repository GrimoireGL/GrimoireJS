declare module "Ammo" {
    export class btVector3 {
        constructor(x:number,y:number,z:number);
    }

    export class btTransform {
        constructor();

        setIdentity();

        setOrigin(origin:btVector3);
    }

    export class btDefaultCollisionConfiguration
    {

    }

    export class btDispatcher {
        
    }

    export class btCollisionDispatcher extends btDispatcher {
        constructor(config:btDefaultCollisionConfiguration);
    }

    export class btDbvtBroadphase {
        
    }

    export class btSequentialImpulseConstraintSolver {
        
    }

    export class btDiscreteDynamicsWorld {
        constructor(dispatcher: btCollisionDispatcher, overlappingPairCache: btDbvtBroadphase, solver: btSequentialImpulseConstraintSolver, config: btDefaultCollisionConfiguration);

        setGravity(gravity:btVector3);
    }
}