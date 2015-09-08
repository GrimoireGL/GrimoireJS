interface LightTypeDeclaration {
    typeName: string,
    shaderfuncName: string,
    diffuseFragmentCode: string,
    specularFragmentCode:string,
    requiredParamCount?:number
}

export=LightTypeDeclaration;