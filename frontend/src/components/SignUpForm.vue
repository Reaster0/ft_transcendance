<template>
  <form @submit.prevent="handleSubmit">
	<label>Email:</label>
	<input inputType="email" required v-model="email">
	
	<label>Password:</label>
	<input inputType="password" required v-model="password">
	<div v-if="passwordError" class="error">
		<p>Password must be at least 6 characters</p>
	</div>

	<div class="submit">
		<button class="FormButton">Create Account</button>
	</div>

  </form>

  <p>Email:{{ email }}</p>
  <p>Password:{{ password }}</p>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			password: '',
			passwordError: '',
		}
	},
	methods: {
		handleSubmit() {
			this.passwordError = this.password.length > 5 ?
			'' : "passsword must be at least 6 characters";
		}
	},
}
</script>

<style>
form {
    max-width: 420px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 30px;
    border-radius: 5px;
}
label {
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
}
input, select {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
}
input[type="checkbox"] {
    display: inline-block;
    width: 16px;
    margin: 0 10px 0 0;
    position: relative;
    top: 2px;
}
.FormButton {
    background: #0b6dff;
    border: 0;
    padding: 10px 20px;
    margin-top: 20px;
    color: white;
    border-radius: 20px;
  }
  .submit {
    text-align: center;
  }
  .error {
    color: #ff0062;
    margin-top: 10px;
    font-size: 0.8em;
    font-weight: bold;
  }
</style>