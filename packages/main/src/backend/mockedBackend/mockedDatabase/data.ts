import type { User, Operation, Group } from '../../../../../types';

class MockDatabase {
    private loggedIn = false;
    //set of users on startup. Generated with testDataGenerators/gen_users.sh
    private readonly users: Map<string, User> = new Map<string, User>([
        ['d63ef06e-50fa-4ff1-b0ff-61ced9af154f', {id: '14baea6f-5e6c-4d7f-972c-5b2c0c02950f', username: 'admin', first_name: 'admin', last_name: 'admin', is_admin: true, pass: 'admin'}],
        ['827bf9cd-f911-43a0-9e41-fb52c9295e8d', {id: '827bf9cd-f911-43a0-9e41-fb52c9295e8d', username: 'TestUser1', first_name: 'FvTHZDLRdMwLGdAKLfML', last_name: 'ckgMhsOvHJXtmumxgUir', is_admin: false, pass: 'testpw'}],
        ['94a66e6a-edec-4160-a582-ee177f4b0c63', {id: '94a66e6a-edec-4160-a582-ee177f4b0c63', username: 'TestUser2', first_name: 'tYwSHbsHhTzaZjzssGfy', last_name: 'XHFkSHwpruaxizAxLizb', is_admin: false, pass: 'testpw'}],
        ['45e948a9-e9d4-4ac7-b5c7-7b08c64ded20', {id: '45e948a9-e9d4-4ac7-b5c7-7b08c64ded20', username: 'TestUser3', first_name: 'ZqxxJphkRZUmVlmjsuiZ', last_name: 'ljudDmDdeBsNPfAijDnO', is_admin: false, pass: 'testpw'}],
        ['dd5271cf-1132-4086-9852-d7f4ee889767', {id: 'dd5271cf-1132-4086-9852-d7f4ee889767', username: 'TestUser4', first_name: 'zefKqnqvBRQBFVIowJkf', last_name: 'owSQjCNRjMmLeKbslxRW', is_admin: false, pass: 'testpw'}],
        ['9ed8ab53-87f0-46cc-b0d8-e0c37dd7209b', {id: '9ed8ab53-87f0-46cc-b0d8-e0c37dd7209b', username: 'TestUser5', first_name: 'RQfXjdmdibOSyGACKqqi', last_name: 'QuLutkGqjSyOWYZicgbS', is_admin: false, pass: 'testpw'}],
        ['a24f1ebb-cfc8-4b73-9e51-ba93bb03cca8', {id: 'a24f1ebb-cfc8-4b73-9e51-ba93bb03cca8', username: 'TestUser6', first_name: 'EGogSAYxEcjXcJYTESEj', last_name: 'GUGoaZlQKXEOBlvHKATO', is_admin: false, pass: 'testpw'}],
        ['34c13975-7cab-4a75-84b4-fd5349440edc', {id: '34c13975-7cab-4a75-84b4-fd5349440edc', username: 'TestUser7', first_name: 'TShPoOVCFirHjQcrmnSd', last_name: 'CPiNWslNCwYGCOxgRgbh', is_admin: false, pass: 'testpw'}],
        ['b5782cc2-c41b-4b13-953b-562b714fb7b3', {id: 'b5782cc2-c41b-4b13-953b-562b714fb7b3', username: 'TestUser8', first_name: 'NCTtsvDAKKnHJyfNanbe', last_name: 'YqMiGfXwRzQdFWdwFaxS', is_admin: false, pass: 'testpw'}],
        ['2e2f96e9-07e7-4681-b9c2-7706dd76e8cf', {id: '2e2f96e9-07e7-4681-b9c2-7706dd76e8cf', username: 'TestUser9', first_name: 'vLeDhncAyRgSHKMvmylC', last_name: 'MTcKoZnndrNWMlyBoJZh', is_admin: false, pass: 'testpw'}],
        ['24a74581-df9c-4739-b33d-a65530d31515', {id: '24a74581-df9c-4739-b33d-a65530d31515', username: 'TestUser10', first_name: 'KJBARxmgbfjxtYOlXCyJ', last_name: 'xQDJSJqIiqlmDGEcvdnz', is_admin: false, pass: 'testpw'}],
        ['6651c2e0-a55c-4080-a882-660a0ca1fa33', {id: '6651c2e0-a55c-4080-a882-660a0ca1fa33', username: 'TestUser11', first_name: 'hDMozMdnNhhlHMWuSaON', last_name: 'nBqsQPObVSvOsMhIBUKP', is_admin: false, pass: 'testpw'}],
        ['4c2274fc-576e-42c7-89ff-0e63edba0ec3', {id: '4c2274fc-576e-42c7-89ff-0e63edba0ec3', username: 'TestUser12', first_name: 'WiiAaCKXjFrjCVZDcZEF', last_name: 'CuWVNTLIXCyKnNtfjkJj', is_admin: false, pass: 'testpw'}],
        ['b0a7145a-b4b2-4090-9a05-50a901a57769', {id: 'b0a7145a-b4b2-4090-9a05-50a901a57769', username: 'TestUser13', first_name: 'WhLAUIgilfjtfzTmgBzX', last_name: 'sRctmwgLAAzpnniOPSlI', is_admin: false, pass: 'testpw'}],
        ['6688d1fb-a9ca-4987-9237-6616edec0596', {id: '6688d1fb-a9ca-4987-9237-6616edec0596', username: 'TestUser14', first_name: 'kMXiIIZrdtkBsiFPCzfJ', last_name: 'OZUlrYZTamKnawJAxbqp', is_admin: false, pass: 'testpw'}],
        ['15967ee4-334b-43c4-8783-72841a07d85a', {id: '15967ee4-334b-43c4-8783-72841a07d85a', username: 'TestUser15', first_name: 'mDvANKbQVAnhRKPIACIF', last_name: 'gPlQsmjzisdssHAgfRpC', is_admin: false, pass: 'testpw'}],
        ['56955da3-ba67-4a10-aa90-2b147ccb8209', {id: '56955da3-ba67-4a10-aa90-2b147ccb8209', username: 'TestUser16', first_name: 'BuzGtTVdRXWXDYpFrcYO', last_name: 'XFDlnotbyShTiQTvXCDu', is_admin: false, pass: 'testpw'}],
        ['0faf22fa-f60b-45e9-a96b-0e73c93d3836', {id: '0faf22fa-f60b-45e9-a96b-0e73c93d3836', username: 'TestUser17', first_name: 'rmEkhzMPUOUaruXVWCnF', last_name: 'qpBfeEdOcLlbNRftSQkw', is_admin: false, pass: 'testpw'}],
        ['374d383f-e4f0-4fd9-848d-8f272374c8db', {id: '374d383f-e4f0-4fd9-848d-8f272374c8db', username: 'TestUser18', first_name: 'REVHmyKxcTRDFZooMdbb', last_name: 'kgWzGUgkWoUMpjPtgLhx', is_admin: false, pass: 'testpw'}],
        ['f7300dfe-f4c1-41c8-87d7-edbeaea82b69', {id: 'f7300dfe-f4c1-41c8-87d7-edbeaea82b69', username: 'TestUser19', first_name: 'nijOHSaDjliFHZohBvTK', last_name: 'lTbqArfnzfJBVSIWgjzy', is_admin: false, pass: 'testpw'}],
        ['ddfb1acc-8a21-4f67-b124-67086bd72a9d', {id: 'ddfb1acc-8a21-4f67-b124-67086bd72a9d', username: 'TestUser20', first_name: 'iowpvmJKbFNbAoJWHwwh', last_name: 'nldhXyMgZARzmcDtqGLd', is_admin: false, pass: 'testpw'}],
    ]);
    //set of operations on startup. Generated with testDataGenerators/gen_operations.sh
    private readonly operations: Map<string, Operation> = new Map<string, Operation>([
        ['1b62431d-c316-4cae-a202-5fa2e49e9a5c', {id: '1b62431d-c316-4cae-a202-5fa2e49e9a5c', title: 'lyHocaVHgpdIcJnEPVhM', description: 'kTtgKUFTehiwDmLLAfMi', start: new Date(1664110585), end: new Date(1664117461), is_archived: true}],
        ['5d5f61d8-1183-4eaa-8a24-36de58b2ef09', {id: '5d5f61d8-1183-4eaa-8a24-36de58b2ef09', title: 'TzpkuIPDMxkQZDsimzZe', description: 'PGxRvMjQLceQHdhMhUzp', start: new Date(1664097493), end: new Date(1664114139), is_archived: false}],
        ['c1bb2fe4-b60e-4de4-9a81-db705ff59519', {id: 'c1bb2fe4-b60e-4de4-9a81-db705ff59519', title: 'oogGTJCNzMEUMEeGQXlv', description: 'AwaegeEaCxrhOGKLtMdY', start: new Date(1664135177), end: new Date(1664172314), is_archived: true}],
        ['fdd4894f-94d8-49ac-a8a8-32d8786244a0', {id: 'fdd4894f-94d8-49ac-a8a8-32d8786244a0', title: 'nHhsddYJaXJaSNnQTnJz', description: 'wvJLcZsLPHQxvdEkQTNZ', start: new Date(1664609140), end: new Date(1664630875), is_archived: true}],
        ['8585e0cc-a20e-4dea-8a80-544db478302e', {id: '8585e0cc-a20e-4dea-8a80-544db478302e', title: 'MHTyDdNBfhJEJGFPJeus', description: 'sXhdYLsffEjYrnUYEqYX', start: new Date(1664734404), end: new Date(1664755690), is_archived: true}],
        ['e8c4a292-bfd8-4c91-b982-e170231c1d1b', {id: 'e8c4a292-bfd8-4c91-b982-e170231c1d1b', title: 'pGZqvmDiYsfgmDSftCRK', description: 'OputxZMffEkNUccAVkDM', start: new Date(1664954317), end: new Date(1664976517), is_archived: false}],
        ['4d292f02-2ea1-47c4-b6ad-d387d3bb90cb', {id: '4d292f02-2ea1-47c4-b6ad-d387d3bb90cb', title: 'cohrVGNNexgxyxaZPRcr', description: 'NbSarSOqtsdbBRJZoPCO', start: new Date(1663311508), end: new Date(1663330901), is_archived: false}],
        ['ef83d1dd-0d78-4f6a-99b7-8e83fc050868', {id: 'ef83d1dd-0d78-4f6a-99b7-8e83fc050868', title: 'pdtlbSRzHXkpQedoczrL', description: 'NLzreudYgHHasUCBuWbb', start: new Date(1663751662), end: new Date(1663777151), is_archived: true}],
        ['7f41b4e4-28f7-42d6-827f-ebb6bd2e6353', {id: '7f41b4e4-28f7-42d6-827f-ebb6bd2e6353', title: 'UkVoBvWcvBDCsUjVUrwq', description: 'wvDlhTYYhEHkykKZHsvs', start: new Date(1663212204), end: new Date(1663246978), is_archived: true}],
        ['07b00ab6-54ae-4772-b655-2d1002d94e0d', {id: '07b00ab6-54ae-4772-b655-2d1002d94e0d', title: 'yueJMOzsfqSENlywNwvW', description: 'ZpqnWVhggGqrsbCBffho', start: new Date(1664385158), end: new Date(1664400697), is_archived: false}],
        ['e50f7d4c-ddff-4e9c-bca9-f2a285a35f22', {id: 'e50f7d4c-ddff-4e9c-bca9-f2a285a35f22', title: 'PeUEZylQAdKFRWUIsWrp', description: 'tmMmXbzdVdkiDhywhbSb', start: new Date(1664708294), end: new Date(1664749779), is_archived: false}],
        ['c8320adb-a352-40ab-9139-c8bca7e985d0', {id: 'c8320adb-a352-40ab-9139-c8bca7e985d0', title: 'UEmchwdRXRLHtPusTUlY', description: 'YSrbSjyFlSFliqEmvPia', start: new Date(1665227684), end: new Date(1665245712), is_archived: false}],
        ['4c0de7db-53d9-456b-a9f7-3f65d1d4aeec', {id: '4c0de7db-53d9-456b-a9f7-3f65d1d4aeec', title: 'HaVUvcfLzSpHoGLnFBZA', description: 'kUcfGmLKccmQCcDdDgVY', start: new Date(1664398748), end: new Date(1664440313), is_archived: true}],
        ['9cdd0d10-58e0-4cba-bc44-f94ee55bd470', {id: '9cdd0d10-58e0-4cba-bc44-f94ee55bd470', title: 'DnfbqKhdZAmXlneNXjVT', description: 'zMNRTKtcYsvbHYQGvgCc', start: new Date(1664960923), end: new Date(1664975865), is_archived: true}],
        ['33d4753c-769e-40f2-9ee8-a84a0b97ffc5', {id: '33d4753c-769e-40f2-9ee8-a84a0b97ffc5', title: 'pSSjpUlZuGuMEXWjwDts', description: 'oAryAQhRRIgKSJRXlywd', start: new Date(1665169083), end: new Date(1665175541), is_archived: true}],
        ['5483cfc2-b02e-4379-9298-ddae720c0d48', {id: '5483cfc2-b02e-4379-9298-ddae720c0d48', title: 'VnkIHVkRmrkDaPzmiNFx', description: 'VDaqTaCyjhvsIyrFYyfM', start: new Date(1664766729), end: new Date(1664799018), is_archived: false}],
        ['4c8e1fdb-727f-43ab-8874-9e7cfc135dd7', {id: '4c8e1fdb-727f-43ab-8874-9e7cfc135dd7', title: 'JviuZstRXJTcKUFgeCIT', description: 'QrqvDuPhwdCvyBJGePnq', start: new Date(1664387364), end: new Date(1664426059), is_archived: false}],
        ['23e26103-bcff-4693-bed0-705209ed464d', {id: '23e26103-bcff-4693-bed0-705209ed464d', title: 'fXAkmhltKhkhJRyCKlSr', description: 'xAnQHCDxJeJpkHAqtVBx', start: new Date(1664221329), end: new Date(1664246320), is_archived: false}],
        ['6aa8f56b-1e6a-4d0f-9d60-19778e2241d3', {id: '6aa8f56b-1e6a-4d0f-9d60-19778e2241d3', title: 'EKqfekKKcjetcvsGTJGf', description: 'kpvBFYjcyghtlesqwFmK', start: new Date(1663816747), end: new Date(1663842496), is_archived: false}],
        ['22f774d9-916c-40a0-8d77-e2251d659d2e', {id: '22f774d9-916c-40a0-8d77-e2251d659d2e', title: 'MSnBTrEbMMOmCywFXmwo', description: 'wGcnKBCQkPtubyivRBzP', start: new Date(1664603712), end: new Date(1664623808), is_archived: false}],
    ]);
    //set of groups on startup. Generated with testDataGenerators/gen_groups.sh
    private readonly groups: Map<string, Group> = new Map<string, Group>([
        ['b4f099f3-3e14-41b6-8d44-de83620276de', {id: 'b4f099f3-3e14-41b6-8d44-de83620276de', title: 'RlJTqKkjJTuwmhzYgfDV', description: 'bTiIUKmHsycnfqItvuqx', members:[]}],
        ['49e49508-ffaf-4811-bab0-b0c65045b822', {id: '49e49508-ffaf-4811-bab0-b0c65045b822', title: 'hmByYhqGpjvgiSPnBYEy', description: 'vMXmsJLtkwgDKbMmqWIz', members:[]}],
        ['d8384167-6dfb-44f3-b25e-c510dc0e167b', {id: 'd8384167-6dfb-44f3-b25e-c510dc0e167b', title: 'nnkEeaQzplpEvjBQjzJm', description: 'WPMQVZuBcDOmCzcdhQnz', members:[]}],
        ['614e79ef-a0b7-4e49-8c7f-32c3d90ee8ac', {id: '614e79ef-a0b7-4e49-8c7f-32c3d90ee8ac', title: 'kkBGZPUggIRvtKErLDmk', description: 'ScNLJxpmPOwfsmnaVMFv', members:[]}],
        ['7b9c62e0-18f2-49df-a9b9-bfe900647d47', {id: '7b9c62e0-18f2-49df-a9b9-bfe900647d47', title: 'kszNZejmJRtxyMHMvOYs', description: 'ZyHuYjBbSorXnGtPOZFq', members:[]}],
        ['f234d975-7997-4bde-9855-707b0c989e4e', {id: 'f234d975-7997-4bde-9855-707b0c989e4e', title: 'OJAxeICMObBfmlsFZUZw', description: 'tAuiyDMapIvhHNDawCvQ', members:[]}],
        ['9f75a995-246c-4e27-87b1-8464e798dd0b', {id: '9f75a995-246c-4e27-87b1-8464e798dd0b', title: 'dQnpXrBRWsKDWTQEXVsf', description: 'McwCpqNNSDUpkLmRvaEA', members:[]}],
        ['a0dff50b-a463-486c-a559-e944c6507aa3', {id: 'a0dff50b-a463-486c-a559-e944c6507aa3', title: 'rZjlaAJTsKWrNMfSKzBf', description: 'eNIzTOGvLINhVLCIFfeR', members:[]}],
        ['11b8861e-08fd-41ae-a9ac-e0782aed9829', {id: '11b8861e-08fd-41ae-a9ac-e0782aed9829', title: 'TYQFdCWBtTLNmeGUTsXD', description: 'BNJHxWVhWJbKkQxrmUlQ', members:[]}],
        ['6c39e458-0c75-452c-a3ff-3e01a6146fa0', {id: '6c39e458-0c75-452c-a3ff-3e01a6146fa0', title: 'HIdxRpSbzhuxSxfadQqm', description: 'yTgTtdYSuTsQWjeEcMRw', members:[]}],
        ['7099b06a-23f0-49e2-a193-43f70d5c0ac5', {id: '7099b06a-23f0-49e2-a193-43f70d5c0ac5', title: 'MaNSxFOcZDuQlkOlBvGt', description: 'YJxjAoFsnGRPKmkqitDe', members:[]}],
        ['aa271bc3-faf1-4a07-a307-4caf7b9695ba', {id: 'aa271bc3-faf1-4a07-a307-4caf7b9695ba', title: 'fYIMuOsZMcJpAtAGHJNY', description: 'gukQRaWlzeuShqCHTNSy', members:[]}],
        ['c09ce3f5-320b-48a8-8fbe-5730efdb41a1', {id: 'c09ce3f5-320b-48a8-8fbe-5730efdb41a1', title: 'lTKUPhkCmBQofYhnFRJY', description: 'BFpDRApSmOyBZjnYMwzD', members:[]}],
        ['55fd7350-ffff-413f-806a-90dfc28aa8ee', {id: '55fd7350-ffff-413f-806a-90dfc28aa8ee', title: 'nraJtfSOdniiDEDJzDOf', description: 'UyXlPQPilRyyovnjDcbQ', members:[]}],
        ['ff62be18-4f27-40ab-a904-e10650b56d79', {id: 'ff62be18-4f27-40ab-a904-e10650b56d79', title: 'snqVSMlJMBfFMqgRLKAX', description: 'dbLmdCGnsKzxmuEKlvAW', members:[]}],
        ['4cda43f7-059f-410b-871f-b2c27f253023', {id: '4cda43f7-059f-410b-871f-b2c27f253023', title: 'dkixmUUsgxnXcbbBFqvL', description: 'AwHEdvToGJVcXMCvNEAO', members:[]}],
        ['96bd7abb-fca9-4a27-a341-233a53dd472b', {id: '96bd7abb-fca9-4a27-a341-233a53dd472b', title: 'NphRBuxoAmxjFXjmRkOy', description: 'yzTtzxqieEkInFltQqLn', members:[]}],
        ['b02005d5-f8f8-4614-ba7c-3f15d3b2a34d', {id: 'b02005d5-f8f8-4614-ba7c-3f15d3b2a34d', title: 'hRVhzqRwsFcMiUpJCzkq', description: 'tGTEhOQpywQRLGywOJJf', members:[]}],
        ['7fa1fcf1-15d2-46aa-a31f-b21ca1f49455', {id: '7fa1fcf1-15d2-46aa-a31f-b21ca1f49455', title: 'dpkjCMcMUkKAkbzavouf', description: 'QNSqJGCkydBGeSuGMxSP', members:[]}],
        ['790fc1f3-d262-41b4-8daa-369cfa487dde', {id: '790fc1f3-d262-41b4-8daa-369cfa487dde', title: 'WuCTLTeTkGEKLxlrXSaA', description: 'PJEHgyglsOFWevqORgLG', members:[]}],
    ]);

    public getUsers() {
        //shallow copy the map so that sets on the outside don't effect the readonly maps in the db
        return [...this.users.values()];
    }
    public getOperations() {
        //shallow copy the map so that sets on the outside don't effect the readonly maps in the db
        return [...this.operations.values()];
    }
    public getGroups() {
        //shallow copy the map so that sets on the outside don't effect the readonly maps in the db
        return [...this.groups.values()];
    }
    public isLoggedIn() {
        return this.loggedIn;
    }
    public login() {
        this.loggedIn = true;
    }
    public logout() {
        this.loggedIn = false;
    }


}
export const db = new MockDatabase();