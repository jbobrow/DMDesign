//all property lists for the app, these are "static" variables


define(['three'], function(THREE){

    return {

        allMenus: {
            navDesign:{
                name: "Design",
                tabs:{
                    lattice:"Lattice",
                    //sketch:"Sketch",
                    material:"Materials",
//                    import:"Import",
                    part:"Part"
//                    view: "View"
                    //script:"Script"
                }
            },
            navMaterial:{
                name: "Materials",
                parent: "navDesign",
                tabs:{
                    materialEditor: "Material Editor"
                }
            },
            navComposite:{
                name: "Composite",
                parent: "navDesign",
                tabs:{
                    composite:"Composite Editor"
                }
            },
            navSim:{
                name: "Simulate",
                tabs:{
                }
            },
            electronicNavSim:{
                name: "Electronic Simulation",
                parent: "navSim",
                tabs:{
                    eSetup:"Connectivity",
    //                materialProperties: "Materials",
                    eStatic:"Statics",
                    eDynamic:"Dynamics"
                }
            },
            dnaNavSim:{
                name: "DNA Simulation",
                parent: "navSim",
                tabs:{
                    dnaSetup: "Setup"
                }
            },
            mechanicalNavSim:{
                name: "Mechanical Simulation",
                parent: "navSim",
                tabs:{
                    mSetup:"Setup",
    //                materialProperties: "Materials",
                    mStatic:"Statics",
                    mDynamic:"Dynamics"
                }
            },
            navOptimize:{
                name: "Optimize",
                tabs:{
                    optimization:"Optimize"
                }
            },
            navAssemble:{
                name: "Assemble",
                tabs:{
                    assembler:"Assembler",
                    assemblerSetup: "Setup",
                    cam: "Globals",
    //                editCamOutput: "Edit",
                    animation:"Preview"
                }
            },
            navDNAAssemble:{
                name: "Assemble",
                parent: "navAssemble",
                tabs:{
                    dnaExport: "Export"
                }
            },
            navMachineComponent:{
                name: "Component Editor",
                parent: "navAssemble",
                tabs:{
                    editComponent: "Edit Component"
                }
            },
            navComm:{
                name: "Comm",
                tabs:{
                    setupComm: "Setup",
                    send: "Send"
                }
            }
        },

        urls: {
            dnabricks: {
                cellType: "cube",
                connectionType: "gik",
                applicationType: "willGik",
                partType: null
            },
            electronics: {
                cellType: "cube",
                connectionType: "gik",
                applicationType: "dnaBricks",
                partType: null
            }
        },

        allLattices:{
            octa: {
                name: "Octahedron",
                connection: {
                    face: {
                        name: "Face",
                        subclass: "octaFaceLattice",
                        type: {
                            octaTruss: {
                                name: "Matt's Truss",
                                parts: {
                                    triangle: {
                                        name: "Triangle"
                                    }
                                },
                                aspectRatio: new THREE.Vector3(1,1/2*Math.sqrt(3),2/Math.sqrt(6)),
                                materialClasses: ['mechanical']
                            },
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(1,1/2*Math.sqrt(3),2/Math.sqrt(6))
                            }
                        }
                    },
//                    edge: {
//                        name: "Edge (Rotated)",
//                        subclass: "octaEdgeLattice"
//                    },
                    edgeRot: {
                        name: "Edge",
                        subclass: "octaRotEdgeLattice",
                        type: {
                            snapVoxel: {
                                name: "Ben's Voxels",
                                parts: {
                                    vox: {
                                        name: "Snap Voxel (high res)"
                                    },
                                    voxLowPoly: {
                                        name: "Snap Voxel (low res)"
                                    }
                                },
                                aspectRatio: new THREE.Vector3(1,1,Math.sqrt(2)/2),
                                materialClasses: ['mechanical']
                            },
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(1,1,Math.sqrt(2)/2)
                            }
                        }
                    },
                    vertex: {
                        name: "Vertex",
                        subclass: "octaVertexLattice",
                        type: {
                            kennyVertex: {
                                name: "Kenny's Lattice",
                                parts: {
                                    kennyTech: {
                                        name: "Kenny Tech"
                                    },
                                    kennyTechHighRes: {
                                        name: "Kenny Tech (High Res)"
                                    },
                                    samTech: {
                                        name: "Square"
                                    }
                //                   xShape:"X"
                                },
                                aspectRatio: new THREE.Vector3(Math.sqrt(2),Math.sqrt(2),Math.sqrt(2)),
                                materialClasses: ['mechanical']
                            },
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(Math.sqrt(2),Math.sqrt(2),Math.sqrt(2))
                            }
                        }
                    }
                }
            },
            tetra: {
                name: "Tetrahedron",
                connection: {//vertex: "Vertex"
                    stacked: {
                        name: "Stacked",
                        subclass: "tetraStackedLattice",
                        type: {
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(1,1/2*Math.sqrt(3),2/Math.sqrt(6))
                            }
                        }
                    }
                }
                //vetex (1, 1//2*Math.sqrt(3), 2/Math.sqrt(6))
            },
            cube: {
                name: "Cube",
                connection: {
                    face: {
                        name: "Face",
                        subclass: "cubeLattice",
                        type: {
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(1,1,1)
                            }
                        }
                    },
                    gik: {
                        name: "Lego",
                        subclass: "gikLattice",
                        type: {
                            willGik: {
                                name: "Electronic GIK Lattice",
                                parts: {
                                    willLego: {
                                        name: "Micro LEGO (high res)"
                                    },
                                    willLegoLowPoly: {
                                        name: "Micro LEGO (low res)"
                                    }
                                },
                                aspectRatio: new THREE.Vector3(1,1,1.28),
                                materialClasses: ['electronic'],
                                options: {
                                    gikLength: 4,
                                    gikRange: [1,-1],
                                    units: "mm"
                                }
                            },
                            lego: {
                                name: "LEGO",
                                parts: {
                                    lego: {
                                        name: "LEGO Bricks"
                                    }
                                },
                                aspectRatio: new THREE.Vector3(1,1,1.17),
                                materialClasses: ['mechanical'],
                                options: {
                                    scale: 8.2,
                                    units: "mm"
                                }
                            },
                            dnaBricks: {
                                name: "DNA Bricks",
                                parts: {
                                    dnaStraight: {
                                        name: "DNA (straight chains)"
                                    },
                                    dnaLego: {
                                        name: "Lego Blocks"
                                    }
                                },
                                aspectRatio: new THREE.Vector3(1,1,1.08),
                                materialClasses: ['dna'],
                                options: {
                                    gikLength: 2,
                                    gikRange: [1,2],
                                    scale: 2.5,
                                    units: 'nm'
                                }
                            },
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(1,1,1),
                                options:{}
                            }
                        }
                    }
                }
            },
            truncatedCube: {
                name: "Cuboctahedron",
                connection: {
                    face: {
                        name: "Face",
                        subclass: "truncatedCubeLattice",
                        type: {
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(Math.sqrt(2),Math.sqrt(2),Math.sqrt(2))
                            }
                        }
                    }
                }
            },
            kelvin: {
                name: "Kelvin",
                connection: {
                    face: {
                        name: "Face",
                        subclass: "kelvinLattice",
                        type: {
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(2*Math.sqrt(2),2*Math.sqrt(2),2*Math.sqrt(2))
                            }
                        }
                    }
                }
            },
            hex: {
                name: "Honeycomb",
                connection: {
                    face: {
                        name: "Face",
                        subclass: "hexLattice",
                        type: {
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(Math.sqrt(3),1.5,1)
                            }
                        }
                    },
                    faceRot: {
                        name: "Face (Rotated)",
                        subclass: "hexRotLattice",
                        type: {
                            default: {
                                name: "Default",
                                parts: null,
                                aspectRatio: new THREE.Vector3(3,1,Math.sqrt(3)/2)
                            }
                        }
                    }
                }
            }
        },

        allCellModes:{//supercell, cell, part, node, beam
            supercell: "Hierarchical Mode  &nbsp;&nbsp;(H)",
            cell: "Voxel Mode  &nbsp;&nbsp;(V)",
            part: "Part Mode  &nbsp;&nbsp;(P)",
            hide: "Hide Cells  &nbsp;&nbsp;(O)"
        },

        allScripts: {
            loadFile: "Load From File..."
        },

        allUnitTypes: {
            inches: "Inches",
            mm: "mm",
            um: "Micron"
        }

    }
});