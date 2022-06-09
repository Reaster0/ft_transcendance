<template>
  <v-app >
    <v-container fluid >
        <div id="app">
          <v-app id="inspire">
            <div class="text-center">
                <v-card>
                  <v-list>
                    <v-list-item>
                      <v-card color="rgba(0,0,0,0)" flat >
                        <v-toolbar dense color="rgba(0,0,0,0)">
                          <v-btn elevation="0" min-height="50px"  max-width="50px">
                          <v-badge bordered bottom color="green" dot offset-x="4" offset-y="34" class="spacetop" >
                              <v-avatar class="col" elevation="10" size="40px">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Wildlife_at_Maasai_Mara_%28Lion%29.jpg/1200px-Wildlife_at_Maasai_Mara_%28Lion%29.jpg" width="50" height="50">
                              </v-avatar>
                          </v-badge>
                          </v-btn>
                          <v-toolbar-title class="offsetmess">anadege</v-toolbar-title>
                        </v-toolbar>
                      </v-card>
                    </v-list-item>
                  </v-list>
          
                  <v-divider></v-divider>
          
                  <v-list>
                    <div>
                    <p align="left" class="font-weight-black offsetmess spacetoponly">
                      Ban this user for 30 days
                    </p>
                    </div>
                    <v-list-item>
                      <v-list-item-action >
                        <v-switch
                          v-model="ban"
                          color="blue"
                        ></v-switch>
                      </v-list-item-action>
                      <br>
                    </v-list-item>

                    <div>
                    <p align="left" class="font-weight-black offsetmess">
                      Mute this user for 30 days
                    </p>
                    </div>
                    <v-list-item>
                      <v-list-item-action >
                        <v-switch
                          v-model="mute"
                          color="blue"
                        ></v-switch>
                      </v-list-item-action>
                      <br>
                    </v-list-item>

                    <div>
                    <p align="left" class="font-weight-black offsetmess">
                      Set this user as admin of the chat
                    </p>
                    </div>
                    <v-list-item>
                      <v-list-item-action >
                        <v-switch
                          v-model="admin"
                          color="blue"
                        ></v-switch>
                      </v-list-item-action>
                      <br>
                    </v-list-item>

                  </v-list>
          
                  <v-card-actions>
                    <v-spacer></v-spacer>
          
                    <v-btn
                      to="/adm"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="rgb(0,0,255)"
                      to="/adm"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>

            </div>
          </v-app>
        </div>
    </v-container>
  </v-app>
</template>



<script>
// создание и объявление компонентов. В темплейте мы по ним будем итерироваться.
// https://codesource.io/vue-export-default-vs-vue-new/
export default 
{
  data: () => ({
    ban: false,
    mute: false,
    admin: false,
  }),
};

</script>


<style scoped>
.border 
{
  border-right: 0.5px solid rgb(196, 192, 207);
}
.spacebottom {
  padding-top: 20px;
  padding-bottom: 24px;
}
.spacetop {
  padding-top: 20px;
  padding-bottom: 20px;
}

.spacetoponly {
  padding-top: 20px;
}

.offsetmess {
  padding-right: 10px;
  padding-left: 20px;
}

.offsetphoto {
  padding-top: 20px;
}

.row>.col {
  flex-basis: auto;
}

</style>
