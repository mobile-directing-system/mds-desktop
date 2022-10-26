import type { User, Operation, Group, Permission } from '../../../../../types';
import {PermissionNames} from '../../../../../renderer/src/constants';
import {v4 as uuid} from 'uuid';
import { difference } from 'lodash';

class MockDatabase {
    private loggedIn = false;
    private loggedInUserId = '';
    //set of users on startup. Generated with testDataGenerators/gen_users.sh
    private readonly users: Map<string, User> = new Map<string, User>([
        ['14baea6f-5e6c-4d7f-972c-5b2c0c02950f', {id: '14baea6f-5e6c-4d7f-972c-5b2c0c02950f', username: 'admin', first_name: 'admin', last_name: 'admin', is_active: true, is_admin: true, pass: 'admin'}],
        ['827bf9cd-f911-43a0-9e41-fb52c9295e8d', {id: '827bf9cd-f911-43a0-9e41-fb52c9295e8d', username: 'TestUser1', first_name: 'FvTHZDLRdMwLGdAKLfML', last_name: 'ckgMhsOvHJXtmumxgUir', is_active: true, is_admin: false, pass: 'testpw'}],
        ['94a66e6a-edec-4160-a582-ee177f4b0c63', {id: '94a66e6a-edec-4160-a582-ee177f4b0c63', username: 'TestUser2', first_name: 'tYwSHbsHhTzaZjzssGfy', last_name: 'XHFkSHwpruaxizAxLizb', is_active: true, is_admin: false, pass: 'testpw'}],
        ['45e948a9-e9d4-4ac7-b5c7-7b08c64ded20', {id: '45e948a9-e9d4-4ac7-b5c7-7b08c64ded20', username: 'TestUser3', first_name: 'ZqxxJphkRZUmVlmjsuiZ', last_name: 'ljudDmDdeBsNPfAijDnO', is_active: true, is_admin: false, pass: 'testpw'}],
        ['dd5271cf-1132-4086-9852-d7f4ee889767', {id: 'dd5271cf-1132-4086-9852-d7f4ee889767', username: 'TestUser4', first_name: 'zefKqnqvBRQBFVIowJkf', last_name: 'owSQjCNRjMmLeKbslxRW', is_active: true, is_admin: false, pass: 'testpw'}],
        ['9ed8ab53-87f0-46cc-b0d8-e0c37dd7209b', {id: '9ed8ab53-87f0-46cc-b0d8-e0c37dd7209b', username: 'TestUser5', first_name: 'RQfXjdmdibOSyGACKqqi', last_name: 'QuLutkGqjSyOWYZicgbS', is_active: true, is_admin: false, pass: 'testpw'}],
        ['a24f1ebb-cfc8-4b73-9e51-ba93bb03cca8', {id: 'a24f1ebb-cfc8-4b73-9e51-ba93bb03cca8', username: 'TestUser6', first_name: 'EGogSAYxEcjXcJYTESEj', last_name: 'GUGoaZlQKXEOBlvHKATO', is_active: true, is_admin: false, pass: 'testpw'}],
        ['34c13975-7cab-4a75-84b4-fd5349440edc', {id: '34c13975-7cab-4a75-84b4-fd5349440edc', username: 'TestUser7', first_name: 'TShPoOVCFirHjQcrmnSd', last_name: 'CPiNWslNCwYGCOxgRgbh', is_active: true, is_admin: false, pass: 'testpw'}],
        ['b5782cc2-c41b-4b13-953b-562b714fb7b3', {id: 'b5782cc2-c41b-4b13-953b-562b714fb7b3', username: 'TestUser8', first_name: 'NCTtsvDAKKnHJyfNanbe', last_name: 'YqMiGfXwRzQdFWdwFaxS', is_active: true, is_admin: false, pass: 'testpw'}],
        ['2e2f96e9-07e7-4681-b9c2-7706dd76e8cf', {id: '2e2f96e9-07e7-4681-b9c2-7706dd76e8cf', username: 'TestUser9', first_name: 'vLeDhncAyRgSHKMvmylC', last_name: 'MTcKoZnndrNWMlyBoJZh', is_active: true, is_admin: false, pass: 'testpw'}],
        ['24a74581-df9c-4739-b33d-a65530d31515', {id: '24a74581-df9c-4739-b33d-a65530d31515', username: 'TestUser10', first_name: 'KJBARxmgbfjxtYOlXCyJ', last_name: 'xQDJSJqIiqlmDGEcvdnz', is_active: true, is_admin: false, pass: 'testpw'}],
        ['6651c2e0-a55c-4080-a882-660a0ca1fa33', {id: '6651c2e0-a55c-4080-a882-660a0ca1fa33', username: 'TestUser11', first_name: 'hDMozMdnNhhlHMWuSaON', last_name: 'nBqsQPObVSvOsMhIBUKP', is_active: true, is_admin: false, pass: 'testpw'}],
        ['4c2274fc-576e-42c7-89ff-0e63edba0ec3', {id: '4c2274fc-576e-42c7-89ff-0e63edba0ec3', username: 'TestUser12', first_name: 'WiiAaCKXjFrjCVZDcZEF', last_name: 'CuWVNTLIXCyKnNtfjkJj', is_active: true, is_admin: false, pass: 'testpw'}],
        ['b0a7145a-b4b2-4090-9a05-50a901a57769', {id: 'b0a7145a-b4b2-4090-9a05-50a901a57769', username: 'TestUser13', first_name: 'WhLAUIgilfjtfzTmgBzX', last_name: 'sRctmwgLAAzpnniOPSlI', is_active: true, is_admin: false, pass: 'testpw'}],
        ['6688d1fb-a9ca-4987-9237-6616edec0596', {id: '6688d1fb-a9ca-4987-9237-6616edec0596', username: 'TestUser14', first_name: 'kMXiIIZrdtkBsiFPCzfJ', last_name: 'OZUlrYZTamKnawJAxbqp', is_active: true, is_admin: false, pass: 'testpw'}],
        ['15967ee4-334b-43c4-8783-72841a07d85a', {id: '15967ee4-334b-43c4-8783-72841a07d85a', username: 'TestUser15', first_name: 'mDvANKbQVAnhRKPIACIF', last_name: 'gPlQsmjzisdssHAgfRpC', is_active: true, is_admin: false, pass: 'testpw'}],
        ['56955da3-ba67-4a10-aa90-2b147ccb8209', {id: '56955da3-ba67-4a10-aa90-2b147ccb8209', username: 'TestUser16', first_name: 'BuzGtTVdRXWXDYpFrcYO', last_name: 'XFDlnotbyShTiQTvXCDu', is_active: true, is_admin: false, pass: 'testpw'}],
        ['0faf22fa-f60b-45e9-a96b-0e73c93d3836', {id: '0faf22fa-f60b-45e9-a96b-0e73c93d3836', username: 'TestUser17', first_name: 'rmEkhzMPUOUaruXVWCnF', last_name: 'qpBfeEdOcLlbNRftSQkw', is_active: true, is_admin: false, pass: 'testpw'}],
        ['374d383f-e4f0-4fd9-848d-8f272374c8db', {id: '374d383f-e4f0-4fd9-848d-8f272374c8db', username: 'TestUser18', first_name: 'REVHmyKxcTRDFZooMdbb', last_name: 'kgWzGUgkWoUMpjPtgLhx', is_active: true, is_admin: false, pass: 'testpw'}],
        ['f7300dfe-f4c1-41c8-87d7-edbeaea82b69', {id: 'f7300dfe-f4c1-41c8-87d7-edbeaea82b69', username: 'TestUser19', first_name: 'nijOHSaDjliFHZohBvTK', last_name: 'lTbqArfnzfJBVSIWgjzy', is_active: true, is_admin: false, pass: 'testpw'}],
        ['ddfb1acc-8a21-4f67-b124-67086bd72a9d', {id: 'ddfb1acc-8a21-4f67-b124-67086bd72a9d', username: 'TestUser20', first_name: 'iowpvmJKbFNbAoJWHwwh', last_name: 'nldhXyMgZARzmcDtqGLd', is_active: true, is_admin: false, pass: 'testpw'}],
    ]);
    //set of operations on startup. Generated with testDataGenerators/gen_operations.sh
    private readonly operations: Map<string, Operation> = new Map<string, Operation>([
      ['4437f658-9f3c-48e1-96c6-3063cf238d9c', {id: '4437f658-9f3c-48e1-96c6-3063cf238d9c', title: 'TestOperation1', description: 'bWNJbexCLxJDfgHkyuAJ', start: new Date(1665499900000), end: new Date(1665524950000), is_archived: false}],
      ['9bbc7fe6-5be3-4a4e-bf10-1b74123ee906', {id: '9bbc7fe6-5be3-4a4e-bf10-1b74123ee906', title: 'TestOperation2', description: 'XdkJJpZhAIGEBvhxHGPc', start: new Date(1663929299000), end: new Date(1663972340000), is_archived: true}],
      ['1baed006-c802-42fc-9a20-437946f0d0c9', {id: '1baed006-c802-42fc-9a20-437946f0d0c9', title: 'TestOperation3', description: 'yPwAdjLdDkETFoJdUEMc', start: new Date(1664834834000), end: new Date(1664876975000), is_archived: true}],
      ['64766930-86ff-4106-8e0d-cef0a1bbbb6b', {id: '64766930-86ff-4106-8e0d-cef0a1bbbb6b', title: 'TestOperation4', description: 'LNiPjuIVRQFTDIAbCqPq', start: new Date(1664474777000), end: new Date(1664482864000), is_archived: false}],
      ['12684f96-8c92-4596-8350-170d6857f543', {id: '12684f96-8c92-4596-8350-170d6857f543', title: 'TestOperation5', description: 'cOmlNkjqlmYduVGOSHZH', start: new Date(1663989937000), end: new Date(1664007102000), is_archived: true}],
      ['910c7921-92d3-477d-a8f5-6b20a73695fe', {id: '910c7921-92d3-477d-a8f5-6b20a73695fe', title: 'TestOperation6', description: 'XzELlkEZyRsbLuomeIwO', start: new Date(1664923707000), end: new Date(1664927974000), is_archived: false}],
      ['031e9eea-77dc-48dd-b973-243c6fe252fe', {id: '031e9eea-77dc-48dd-b973-243c6fe252fe', title: 'TestOperation7', description: 'djdTFxfElxdPaDHFpMJu', start: new Date(1665269739000), end: new Date(1665293621000), is_archived: true}],
      ['0f089f79-6f7d-4636-bd0a-7bfb7bedee9d', {id: '0f089f79-6f7d-4636-bd0a-7bfb7bedee9d', title: 'TestOperation8', description: 'NvpEgfyRnWBxIgaIGVlL', start: new Date(1664079562000), end: new Date(1664121302000), is_archived: false}],
      ['240e57d2-3720-4c50-9a26-a624817b395f', {id: '240e57d2-3720-4c50-9a26-a624817b395f', title: 'TestOperation9', description: 'qkbPvMPVGNazvFdUNMRW', start: new Date(1664907297000), end: new Date(1664912498000), is_archived: true}],
      ['a29783c7-179e-44f4-90f6-92b56b6529c7', {id: 'a29783c7-179e-44f4-90f6-92b56b6529c7', title: 'TestOperation10', description: 'IDrIJysopLRVyIoFePlz', start: new Date(1665195390000), end: new Date(1665232615000), is_archived: true}],
      ['3d83a99f-d416-4302-bf3d-87512e621785', {id: '3d83a99f-d416-4302-bf3d-87512e621785', title: 'TestOperation11', description: 'dKPWaMrhplsYfInrstof', start: new Date(1665200608000), end: new Date(1665202774000), is_archived: false}],
      ['7de4bfdd-a286-4d9a-8936-1c5d1deb2f73', {id: '7de4bfdd-a286-4d9a-8936-1c5d1deb2f73', title: 'TestOperation12', description: 'NQONBxwclZFwYOdiacck', start: new Date(1664718513000), end: new Date(1664739426000), is_archived: false}],
      ['d3059485-6541-41ae-813a-bae04f4bc6f7', {id: 'd3059485-6541-41ae-813a-bae04f4bc6f7', title: 'TestOperation13', description: 'YcHOLWfzzCMEpoQmAGRB', start: new Date(1663646058000), end: new Date(1663662489000), is_archived: false}],
      ['52195f1e-7ef9-4be5-9912-f5f918c7bb16', {id: '52195f1e-7ef9-4be5-9912-f5f918c7bb16', title: 'TestOperation14', description: 'rhLYLjQBBnGVEyjIKvPv', start: new Date(1663473800000), end: new Date(1663481783000), is_archived: true}],
      ['23a6765d-f267-47fb-a638-1bdbe9fa8f5a', {id: '23a6765d-f267-47fb-a638-1bdbe9fa8f5a', title: 'TestOperation15', description: 'MfZPHrCWeNHXAABDTzFp', start: new Date(1664150403000), end: new Date(1664183710000), is_archived: false}],
      ['528021b3-6f10-4800-a730-27cd803d19fd', {id: '528021b3-6f10-4800-a730-27cd803d19fd', title: 'TestOperation16', description: 'KSKsYKueOucSZymgOSGn', start: new Date(1665499849000), end: new Date(1665524313000), is_archived: true}],
      ['14f930cb-6ada-4583-b1dd-29d0765a702c', {id: '14f930cb-6ada-4583-b1dd-29d0765a702c', title: 'TestOperation17', description: 'jfeWddkoMGcFRDBSajYe', start: new Date(1663618196000), end: new Date(1663659291000), is_archived: false}],
      ['a91d2b13-2f85-4c08-9f5b-338885b9ee33', {id: 'a91d2b13-2f85-4c08-9f5b-338885b9ee33', title: 'TestOperation18', description: 'DyYllLopCKtwgCvNqtdJ', start: new Date(1664094179000), end: new Date(1664118730000), is_archived: false}],
      ['d94ab815-5523-4fef-9fb5-f80e085296be', {id: 'd94ab815-5523-4fef-9fb5-f80e085296be', title: 'TestOperation19', description: 'TeqGHLaPyNauHfWZZjeO', start: new Date(1664202943000), end: new Date(1664213068000), is_archived: false}],
      ['dacd4719-cd89-4b27-bd75-097c89128483', {id: 'dacd4719-cd89-4b27-bd75-097c89128483', title: 'TestOperation20', description: 'JSElgMbycDYWUDSCHBzr', start: new Date(1663145623000), end: new Date(1663148310000), is_archived: true}],
    ]);
    //set of groups on startup. Generated with testDataGenerators/gen_groups.sh
    private readonly groups: Map<string, Group> = new Map<string, Group>([
      ['59348381-6821-492b-b44e-85f13418a60d', {id: '59348381-6821-492b-b44e-85f13418a60d', title: 'TestGroup1', description: 'HlUeyZiNfpqTXPejQgKI', operation: '4437f658-9f3c-48e1-96c6-3063cf238d9c', members:['14baea6f-5e6c-4d7f-972c-5b2c0c02950f', '827bf9cd-f911-43a0-9e41-fb52c9295e8d']}],
      ['be30ceb9-1f90-4d96-ae55-664d8bf25dde', {id: 'be30ceb9-1f90-4d96-ae55-664d8bf25dde', title: 'TestGroup2', description: 'FEXTcKDkNiDoUraktNFx', members:[]}],
      ['30e6c3dc-cb60-453f-aa2a-3ec43bf84c0f', {id: '30e6c3dc-cb60-453f-aa2a-3ec43bf84c0f', title: 'TestGroup3', description: 'sGtkVXSssWZhNYFlFfii', members:[]}],
      ['c0ff0a6c-0493-45ff-9660-bdc6f9da809d', {id: 'c0ff0a6c-0493-45ff-9660-bdc6f9da809d', title: 'TestGroup4', description: 'KqTWwBNuIrylJiYfSvDJ', members:[]}],
      ['9a7bfe04-127d-4b7c-be25-7946b87eeb72', {id: '9a7bfe04-127d-4b7c-be25-7946b87eeb72', title: 'TestGroup5', description: 'MesSwsruxRFFwbrMbDid', members:[]}],
      ['9e7fe17b-e2ef-45a5-976b-59418089a838', {id: '9e7fe17b-e2ef-45a5-976b-59418089a838', title: 'TestGroup6', description: 'iYfhwQOZvJWixNDCjqWm', members:[]}],
      ['1506d0c7-22e8-4a90-89bb-a75b18cae7e4', {id: '1506d0c7-22e8-4a90-89bb-a75b18cae7e4', title: 'TestGroup7', description: 'gIQsUaNzHwLedhgjaYLZ', members:[]}],
      ['c16cd430-63aa-4a07-a194-bbcbac8dc79a', {id: 'c16cd430-63aa-4a07-a194-bbcbac8dc79a', title: 'TestGroup8', description: 'USnAWhukdYxUZxqmeATP', members:[]}],
      ['4674000c-41c1-4534-9ea4-0bf2a99514ec', {id: '4674000c-41c1-4534-9ea4-0bf2a99514ec', title: 'TestGroup9', description: 'CVBWHGjzScnEWTzDmpBQ', members:[]}],
      ['3027862c-3acc-4584-9356-a40e3552865b', {id: '3027862c-3acc-4584-9356-a40e3552865b', title: 'TestGroup10', description: 'DrrjZXiuOvBQAqYDNmdq', members:[]}],
      ['2987690f-bb92-412a-87fc-f9e9d9f4b004', {id: '2987690f-bb92-412a-87fc-f9e9d9f4b004', title: 'TestGroup11', description: 'nMZJsXjrRtxqJyfYCUHr', members:[]}],
      ['8214ac3b-14cb-4e13-8513-18e54c253ddc', {id: '8214ac3b-14cb-4e13-8513-18e54c253ddc', title: 'TestGroup12', description: 'RIVIQktdMDliXiecZpUN', members:[]}],
      ['8382b9c7-a246-4146-aeed-dc70beeab6ca', {id: '8382b9c7-a246-4146-aeed-dc70beeab6ca', title: 'TestGroup13', description: 'gCNewsbjmLscaCabBGDC', members:[]}],
      ['9e2dde1f-1efa-4a91-be22-b4389ac734d2', {id: '9e2dde1f-1efa-4a91-be22-b4389ac734d2', title: 'TestGroup14', description: 'axxiSRMgqXHCHBeaqPKX', members:[]}],
      ['7b0a53e1-1348-4880-8b93-2f05bf4263fb', {id: '7b0a53e1-1348-4880-8b93-2f05bf4263fb', title: 'TestGroup15', description: 'YOGgvOFHpahKDnnuUEqC', members:[]}],
      ['402eec78-5550-4cf2-9b63-3e24875621bc', {id: '402eec78-5550-4cf2-9b63-3e24875621bc', title: 'TestGroup16', description: 'kUQDumDgcsLhcpFpGyCv', members:[]}],
      ['04f9937a-fb31-49dc-9096-194c5bf00a62', {id: '04f9937a-fb31-49dc-9096-194c5bf00a62', title: 'TestGroup17', description: 'NxtfMfNzNxthJXxvUlrt', members:[]}],
      ['75cfb2a5-c35f-4c6d-9955-05defb23bf6f', {id: '75cfb2a5-c35f-4c6d-9955-05defb23bf6f', title: 'TestGroup18', description: 'qFHnIIpcPNWBJFgQzSBv', members:[]}],
      ['ac88ec9d-352b-45fd-b87e-8c7bce61e1b5', {id: 'ac88ec9d-352b-45fd-b87e-8c7bce61e1b5', title: 'TestGroup19', description: 'rdpAXsaWHAcTllEooIql', members:[]}],
      ['e15b77ee-fe88-4d6f-b740-e5cc0ac8fa64', {id: 'e15b77ee-fe88-4d6f-b740-e5cc0ac8fa64', title: 'TestGroup20', description: 'QxikWyBbiHNdUzXMyiLz', members:[]}],
    ]);

    private readonly operationMembers: Map<string, string[]> = new Map<string, string[]>([
      ['4437f658-9f3c-48e1-96c6-3063cf238d9c', ['14baea6f-5e6c-4d7f-972c-5b2c0c02950f', '827bf9cd-f911-43a0-9e41-fb52c9295e8d']],
    ]);

    private readonly permissions: Map<string, Permission[]> = new Map<string, Permission[]>([
      ['827bf9cd-f911-43a0-9e41-fb52c9295e8d', []],
      ['94a66e6a-edec-4160-a582-ee177f4b0c63', [{name: PermissionNames.UserView}, {name:  PermissionNames.OperationViewAny}, {name: PermissionNames.GroupView}]],
      ['45e948a9-e9d4-4ac7-b5c7-7b08c64ded20', [{name: PermissionNames.UserView}, {name:  PermissionNames.OperationViewAny}, {name: PermissionNames.GroupView}, 
        {name: PermissionNames.UserCreate}, {name: PermissionNames.OperationCreate}, {name: PermissionNames.GroupCreate}],
      ],
      ['dd5271cf-1132-4086-9852-d7f4ee889767', [{name: PermissionNames.UserView}, {name:  PermissionNames.OperationViewAny}, {name: PermissionNames.GroupView}, 
        {name: PermissionNames.UserCreate}, {name: PermissionNames.OperationCreate}, {name: PermissionNames.GroupCreate}, {name: PermissionNames.UserUpdate},
        {name: PermissionNames.OperationUpdate}, {name: PermissionNames.GroupUpdate}],
      ],
      ['9ed8ab53-87f0-46cc-b0d8-e0c37dd7209b',[{name: PermissionNames.UserView}, {name:  PermissionNames.OperationViewAny}, {name: PermissionNames.GroupView}, 
        {name: PermissionNames.UserCreate}, {name: PermissionNames.OperationCreate}, {name: PermissionNames.GroupCreate}, {name: PermissionNames.UserUpdate},
        {name: PermissionNames.OperationUpdate}, {name: PermissionNames.GroupUpdate}, {name: PermissionNames.OperationMembersView}],
      ],
      ['a24f1ebb-cfc8-4b73-9e51-ba93bb03cca8',[{name: PermissionNames.UserView}, {name:  PermissionNames.OperationViewAny}, {name: PermissionNames.GroupView}, 
        {name: PermissionNames.UserCreate}, {name: PermissionNames.OperationCreate}, {name: PermissionNames.GroupCreate}, {name: PermissionNames.UserUpdate},
        {name: PermissionNames.OperationUpdate}, {name: PermissionNames.GroupUpdate}, {name: PermissionNames.OperationMembersView},
        {name: PermissionNames.OperationMembersUpdate}],
      ],
      ['34c13975-7cab-4a75-84b4-fd5349440edc',[{name: PermissionNames.UserView}, {name:  PermissionNames.OperationViewAny}, {name: PermissionNames.GroupView}, 
        {name: PermissionNames.UserCreate}, {name: PermissionNames.OperationCreate}, {name: PermissionNames.GroupCreate}, {name: PermissionNames.UserUpdate},
        {name: PermissionNames.OperationUpdate}, {name: PermissionNames.GroupUpdate}, {name: PermissionNames.OperationMembersView},
        {name: PermissionNames.OperationMembersUpdate}, {name: PermissionNames.GroupDelete}],
      ],
      ['b5782cc2-c41b-4b13-953b-562b714fb7b3',[{name: PermissionNames.UserView}, {name:  PermissionNames.OperationViewAny}, {name: PermissionNames.GroupView}, 
        {name: PermissionNames.UserCreate}, {name: PermissionNames.OperationCreate}, {name: PermissionNames.GroupCreate}, {name: PermissionNames.UserUpdate},
        {name: PermissionNames.OperationUpdate}, {name: PermissionNames.GroupUpdate}, {name: PermissionNames.OperationMembersView},
        {name: PermissionNames.OperationMembersUpdate}, {name: PermissionNames.GroupDelete}, {name: PermissionNames.UserSetActive}],
      ],
    ]);

    public checkPermission(permissions: Permission[]) {
      const loggedInPermissions = this.permissions.get(this.loggedInUserId);
      if(this.users.get(this.loggedInUserId) && this.users.get(this.loggedInUserId)?.is_admin) {
        return true;
      }
      if(loggedInPermissions) {
        let userHasPermissions = false;
        if(loggedInPermissions) {
          userHasPermissions = true;
          for(const permission of permissions) {
            if(!(loggedInPermissions.filter((elem) => elem.name === permission.name).length > 0)) {
              userHasPermissions = false;
            }
          }
        }
        return userHasPermissions;
      } else {
        return false;
      }
    }

    //Permission Functions
    public getPermissions(id:string):Permission[] {
      //a user can get his own permissions
      if(id !== this.loggedInUserId && !this.checkPermission([{name: PermissionNames.PermissionsView}])) {
        throw new Error();
      }
      const permissions = this.permissions.get(id);
      return permissions? permissions : [];
    }

    public setPermissions(id: string, permissions: Permission[]):boolean {
      if(!this.userExists(id) || !this.checkPermission([{name: PermissionNames.PermissionsUpdate}])) {
        throw new Error();
      }
      this.permissions.set(id, permissions);
      return true;
    }

    //Login Functions
    public isLoggedIn():boolean {
      return this.loggedIn;
    }

    public login(username: string, password: string): boolean {
      this.loggedIn = true;
      const user = this.getUsersWithPasswords().filter((elem) => elem.username === username );
      if(user.length > 0 && user[0].pass === password) {
        this.loggedInUserId = user[0].id;
        return true;
      } else {
        return false;
      }
    }

    public logout():void {
      this.loggedIn = false;
    }

    //User Functions
    private validateUser(user: User):boolean {
      return Boolean(user.username) && Boolean(user.first_name) && Boolean(user.last_name) && user.is_admin !== undefined;
    }

    private getUsersWithPasswords():User[] {
      //shallow copy the map so that sets on the outside don't effect the readonly maps in the db
      return [...this.users.values()];
    }
    
    public getUsers():User[] {
      if(!this.checkPermission([{name: PermissionNames.UserView}])) {
        throw new Error();
      }
      // remove passwords from the users.
      return this.getUsersWithPasswords().map((elem) => {return {...elem, pass:''};});
    }

    public getUserByUsername(username: string):User {
      //user can get his own user object
      if(username !== this.users.get(this.loggedInUserId)?.username && !this.checkPermission([{name: PermissionNames.UserView}])) {
        throw new Error();
      }
      const usersWithUsername = [...this.users.values()].filter((elem) => elem.username === username);
      if(usersWithUsername.length !== 1) {
        throw new Error();
      }
      return usersWithUsername[0];
    }

    public userExists(id: string):boolean {
      if(!this.checkPermission([{name: PermissionNames.UserView}])) {
        throw new Error();
      }
      return this.users.has(id);
    }

    public getUser(id: string):User {
      //a user can get his own user object
      if(id !== this.loggedInUserId && !this.checkPermission([{name: PermissionNames.UserView}])) {
        throw new Error();
      }
      const user = this.users.get(id);
      if(!user) {
        throw new Error();
      }
      return user;
    }

    public addUser(user: User): User {
      if(!this.checkPermission([{name: PermissionNames.UserCreate}])) {
        throw new Error();
      }
      if(!this.getUsers().map((elem) => elem.username).includes(user.username) && !this.validateUser(user)) {
        throw new Error();
      } else {
        const userWithId = {...user, id: uuid()};
        this.users.set(userWithId.id, userWithId);
        return {...userWithId, pass: ''};
      }
    }

    public updateUser(user: User): boolean {
      if(!this.userExists(user.id) || !this.validateUser(user) || !this.checkPermission([{name: PermissionNames.UserUpdate}])) {
        throw new Error();
      }
      const existingUser = this.getUser(user.id);
      if(existingUser.is_active != user.is_active && !this.checkPermission([{name: PermissionNames.UserSetActive}])) {
        throw new Error();
      }
      if(existingUser.is_admin != existingUser.is_admin && !this.checkPermission([{name: PermissionNames.UserSetAdmin}])) {
        throw new Error();
      }
      this.users.set(user.id, user);
      return true;
    }

    public updateUserPassword(userId: string, password: string): boolean {
      if(!this.userExists(userId) || password !== undefined || !this.checkPermission([{name: PermissionNames.UserUpdatePass}])) {
        throw new Error();
      }
      const user = this.users.get(userId);
      if(user) {
        this.users.set(userId, {...user, pass: password});
      }
      return true;
    }

    public searchUsers(query: string, limit?: number, offset?: number):User[] {
      if(!this.checkPermission([{name: PermissionNames.UserView}])) {
          throw new Error();
      }
      const usersToSearch = this.getUsers().splice(offset? offset:0);
      const result:User[] = [];
      let limitCtr = 1;
      for(const user of usersToSearch) {
        if(limit && limitCtr > limit) {
          break;
        }
        if(user.username.includes(query) || user.first_name.includes(query) || user.last_name.includes(query)) {
          result.push({...user});
          limitCtr = limitCtr + 1;
        }
      }
      return result;
    }

    //Operation Functions
    private validateOperation(operation: Operation):boolean{
      let startBeforeEnd = true;

      if(operation.start && operation.end) {
        startBeforeEnd = operation.start < operation.end;
      }
      return Boolean(operation.title) && startBeforeEnd;
    }

    public getOperations():Operation[] {
      if(!this.checkPermission([{name: PermissionNames.OperationViewAny}])) {
        //if a user does not have the permission to view any operations only return the operations he is a member of
        return [... this.operations.values()].filter((elem) => this.operationMembers.get(elem.id)?.includes(this.loggedInUserId));
      }
      //shallow copy the map so that sets on the outside don't effect the readonly maps in the db
      return [...this.operations.values()];
    }

    public addOpertion(operation: Operation):Operation {
      if(!this.validateOperation(operation) || !this.checkPermission([{name: PermissionNames.OperationCreate}])) {
        throw new Error();
      }
      const operationWithId = {...operation, id: uuid()};
      this.operations.set(operationWithId.id, operationWithId);
      return {...operationWithId};
    }

    public getOperation(id: string):Operation {
      if(!this.checkPermission([{name: PermissionNames.OperationViewAny}])) {
        throw new Error();
      }
      const operation = this.operations.get(id);
      if(!operation) {
        throw Error();
      }
      return operation;
    }

    public operationExists(id: string): boolean {
      if(!this.checkPermission([{name: PermissionNames.OperationViewAny}])) {
        throw new Error();
      }
      return this.operations.has(id);
    }

    public getOperationMembers(id: string): User[] {
      if(!this.operationExists(id) || !this.checkPermission([{name: PermissionNames.OperationMembersView}])) {
        throw new Error();
      }
      const members = this.operationMembers.get(id);
      return members? members.map((elem) => this.getUser(elem)): [];
    }

    public setOperationMembers(id: string, userIds: string[]):boolean {
      if(!this.operationExists(id) || !this.checkPermission([{name: PermissionNames.OperationMembersUpdate}])) {
        throw new Error();
      }
      for(const userId of userIds) {
        if(!this.userExists(userId)) {
          throw new Error();
        }
      }
      const groupsWithOp: Group[] = this.getGroups().filter((elem) => elem.operation === id);
      for(const group of groupsWithOp) {
        this.updateGroup({...group, members: group.members.filter((elem) => !difference(group.members, userIds).includes(elem))});
      }
      this.operationMembers.set(id, userIds);
      return true;
    }

    public updateOperation(operation: Operation): boolean {
      if(!this.operationExists(operation.id) || !this.validateOperation(operation) || !this.checkPermission([{name: PermissionNames.OperationUpdate}])) {
        throw new Error();
      }
      this.operations.set(operation.id, operation);
      return true;
    }

    public searchOperations(query: string, limit?: number, offset?: number):Operation[] {
      if(!this.checkPermission([{name: PermissionNames.OperationViewAny}])) {
        throw new Error();
      }
      const operationsToSearch = this.getOperations().splice(offset? offset:0);
      const result:Operation[] = [];
      let limitCtr = 1;
      for(const operation of operationsToSearch) {
        if(limit && limitCtr > limit) {
          break;
        }
        if(operation.title.includes(query) || operation.description?.includes(query)) {
          result.push({...operation});
          limitCtr = limitCtr + 1;
        }
      }
      return result;
    }

    //Group Functions
    private validateGroup(group: Group): boolean {
      let membersExist = true;
      let membersOfOperation = true;
      let operationMembers;

      if(group.operation) {
        operationMembers = this.getOperationMembers(group.operation);
      }

      if(group.members) {
        //Ensure members exist as users
        for(const member of group.members) {
          if(!this.userExists(member)) {
            membersExist = false;
          }
          if(group.operation) {
            //Ensure members are also members of the associated operation
            if(operationMembers && !operationMembers.map((elem) => elem.id).includes(member)) {
              membersOfOperation = false;
            }
          }
        }
      }

      return Boolean(group.title) && membersExist && membersOfOperation;
    }

    public getGroups(): Group[] {
      if(!this.checkPermission([{name: PermissionNames.GroupView}])) {
        throw new Error();
      }
      //shallow copy the map so that sets on the outside don't effect the readonly maps in the db
      return [...this.groups.values()];
    }

    public getGroup(id: string): Group {
      if(!this.checkPermission([{name: PermissionNames.GroupView}])) {
        throw new Error();
      }
      const group = this.groups.get(id);
      if(!group) {
        throw Error();
      }
      return group;
    }

    public groupExists(id: string): boolean {
      if(!this.checkPermission([{name: PermissionNames.GroupView}])) {
        throw new Error();
      }
      return this.groups.has(id);
    }

    public addGroup(group: Group):Group {
      if(!this.validateGroup(group) || !this.checkPermission([{name: PermissionNames.GroupCreate}])) {
        throw new Error();
      }
      const groupWithId = {...group, id: uuid()};
      this.groups.set(groupWithId.id, groupWithId);
      return {...groupWithId};
    }

    public updateGroup(group: Group):boolean {
      if(!this.groupExists(group.id) || !this.validateGroup(group) || !this.checkPermission([{name: PermissionNames.GroupUpdate}])) {
        throw new Error();
      }
      this.groups.set(group.id, group);
      return true;
    }

    public deleteGroup(groupId: string): boolean {
      if(!this.groupExists(groupId) || !this.checkPermission([{name: PermissionNames.GroupDelete}])) {
        throw new Error();
      }
      this.groups.delete(groupId);
      return true;
    }
}
export const db = new MockDatabase();